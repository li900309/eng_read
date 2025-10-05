import { z } from 'zod'
import { vocabularyService } from '~/server/services/vocabulary.service'

// 请求体验证模式
const submitLearningSchema = z.object({
  vocabularyId: z.string().min(1, '词汇ID不能为空'),
  isCorrect: z.boolean(),
  responseTime: z.number().min(0, '响应时间不能为负数')
})

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

    // 获取请求体
    const body = await readBody(event)
    const validatedData = submitLearningSchema.parse(body)

    // 更新学习进度
    const result = await vocabularyService.updateUserVocabulary(
      auth.id,
      validatedData.vocabularyId,
      validatedData.isCorrect,
      validatedData.responseTime
    )

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('提交学习记录失败:', error)

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: '请求数据验证失败',
        data: {
          errors: error.errors
        }
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : '提交学习记录失败'
    })
  }
})