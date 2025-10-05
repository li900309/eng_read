import { z } from 'zod'
import { llmService } from '~/server/services/llm.service'

// 请求体验证模式
const translateSchema = z.object({
  text: z.string().min(1, '翻译文本不能为空'),
  from: z.string().min(2, '源语言不能为空'),
  to: z.string().min(2, '目标语言不能为空'),
  context: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody(event)
    const validatedData = translateSchema.parse(body)

    // 执行翻译
    const result = await llmService.translate(validatedData)

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('翻译失败:', error)

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
      statusMessage: error instanceof Error ? error.message : '翻译失败'
    })
  }
})