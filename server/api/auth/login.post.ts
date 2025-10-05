import { z } from 'zod'
import { authService } from '~/server/services/auth.service'

// 请求体验证模式
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符')
})

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody(event)

    // 验证输入
    const validatedData = loginSchema.parse(body)

    // 执行登录
    const result = await authService.login(validatedData)

    // 设置认证Cookie
    setCookie(event, 'auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/'
    })

    // 返回响应
    return {
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    }
  } catch (error) {
    console.error('登录失败:', error)

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: '输入数据验证失败',
        data: {
          errors: error.errors
        }
      })
    }

    throw createError({
      statusCode: 401,
      statusMessage: error instanceof Error ? error.message : '登录失败'
    })
  }
})