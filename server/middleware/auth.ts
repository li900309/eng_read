import { authService } from '~/server/services/auth.service'

// 需要认证的API路径
const protectedPaths = [
  '/api/vocabulary/user',
  '/api/learning',
  '/api/statistics',
  '/api/user/preferences'
]

// 公开的API路径
const publicPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/vocabulary/public',
  '/api/llm/translate',
  '/api/llm/grammar-check'
]

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  // 只处理API请求
  if (!pathname.startsWith('/api')) {
    return
  }

  // 检查是否是公开路径
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return
  }

  // 检查是否是受保护的路径
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = getCookie(event, 'auth-token') ||
                 getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: '未提供认证令牌'
      })
    }

    try {
      const user = await authService.verifyToken(token)
      if (!user) {
        throw createError({
          statusCode: 401,
          statusMessage: '无效的认证令牌'
        })
      }

      // 将用户信息添加到事件上下文
      event.context.auth = user
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: '认证失败'
      })
    }
  }
})