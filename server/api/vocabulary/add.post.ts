import { z } from 'zod'
import { vocabularyService } from '~/server/services/vocabulary.service'

// 请求体验证模式
const addVocabularySchema = z.object({
  vocabularyId: z.string().min(1, '词汇ID不能为空')
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
    const validatedData = addVocabularySchema.parse(body)

    // 添加词汇到用户学习列表
    const result = await vocabularyService.addVocabularyToUser(
      auth.id,
      validatedData.vocabularyId
    )

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('添加词汇失败:', error)

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
      statusMessage: error instanceof Error ? error.message : '添加词汇失败'
    })
  }
})