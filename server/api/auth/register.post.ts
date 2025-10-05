import { z } from 'zod'
import { authService } from '~/server/services/auth.service'

// 请求体验证模式
const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword']
})

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody(event)

    // 验证输入
    const validatedData = registerSchema.parse(body)

    // 执行注册
    const result = await authService.register(validatedData)

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
    console.error('注册失败:', error)

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
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : '注册失败'
    })
  }
})