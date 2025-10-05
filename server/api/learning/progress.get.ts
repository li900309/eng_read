import { vocabularyService } from '~/server/services/vocabulary.service'

export default defineEventHandler(async (event) => {
  try {
    // 检查用户认证
    const auth = event.context.auth
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: '需要用户认证'
      })
    }

    // 获取用户学习进度
    const progress = await vocabularyService.getUserLearningProgress(auth.id)

    return {
      success: true,
      data: progress
    }
  } catch (error) {
    console.error('获取学习进度失败:', error)

    throw createError({
      statusCode: 500,
      statusMessage: '获取学习进度失败'
    })
  }
})