import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pkg from '@prisma/client'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '~/types/auth'

const { PrismaClient } = pkg

const prisma = new PrismaClient()

export class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // 验证密码确认
    if (data.password !== data.confirmPassword) {
      throw new Error('密码确认不匹配')
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email.toLowerCase() },
          { username: data.username }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === data.email.toLowerCase()) {
        throw new Error('邮箱已被注册')
      }
      if (existingUser.username === data.username) {
        throw new Error('用户名已被使用')
      }
    }

    // 创建新用户
    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        username: data.username,
        passwordHash,
        preferences: {
          language: 'zh-CN',
          theme: 'light',
          dailyGoal: 10,
          difficultyLevel: 'beginner'
        }
      }
    })

    // 生成JWT令牌
    const token = this.generateToken(user)

    // 返回用户信息（排除密码哈希）
    const { passwordHash: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword as User,
      token
    }
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: credentials.email.toLowerCase() }
    })

    if (!user) {
      throw new Error('邮箱或密码错误')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new Error('邮箱或密码错误')
    }

    // 检查用户是否激活
    if (!user.isActive) {
      throw new Error('账户已被禁用')
    }

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // 生成JWT令牌
    const token = this.generateToken(user)

    // 返回用户信息（排除密码哈希）
    const { passwordHash: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword as User,
      token
    }
  }

  /**
   * 验证JWT令牌
   */
  async verifyToken(token: string): Promise<User | null> {
    try {
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        throw new Error('JWT密钥未配置')
      }

      const decoded = jwt.verify(token, jwtSecret) as any
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user || !user.isActive) {
        return null
      }

      const { passwordHash: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    } catch (error) {
      return null
    }
  }

  /**
   * 更新用户偏好设置
   */
  async updateUserPreferences(userId: string, preferences: any): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences,
        updatedAt: new Date()
      }
    })

    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  /**
   * 生成JWT令牌
   */
  private generateToken(user: any): string {
    const jwtSecret = process.env.JWT_SECRET
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

    if (!jwtSecret) {
      throw new Error('JWT密钥未配置')
    }

    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      jwtSecret,
      { expiresIn }
    )
  }
}

// 导出单例
export const authService = new AuthService()