export default defineEventHandler(async (event) => {
  try {
    // 清除认证Cookie
    deleteCookie(event, 'auth-token', {
      path: '/'
    })

    return {
      success: true,
      data: {
        message: '退出登录成功'
      }
    }
  } catch (error) {
    console.error('退出登录失败:', error)

    throw createError({
      statusCode: 500,
      statusMessage: '退出登录失败'
    })
  }
})