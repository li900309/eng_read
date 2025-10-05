import { z } from 'zod'
import { vocabularyService } from '~/server/services/vocabulary.service'

// 查询参数验证模式
const querySchema = z.object({
  categoryId: z.string().optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  user: z.string().optional() // 如果为'true'，返回用户词汇列表
})

export default defineEventHandler(async (event) => {
  try {
    // 获取查询参数
    const query = getQuery(event)
    const validatedQuery = querySchema.parse(query)

    // 获取认证用户信息（如果有）
    const auth = event.context.auth

    // 如果请求用户词汇列表且用户已认证
    if (validatedQuery.user === 'true' && auth) {
      const result = await vocabularyService.getUserVocabularies(auth.id, {
        categoryId: validatedQuery.categoryId,
        difficulty: validatedQuery.difficulty,
        search: validatedQuery.search,
        page: validatedQuery.page,
        limit: validatedQuery.limit
      })

      return {
        success: true,
        data: result,
        meta: {
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages
          },
          timestamp: new Date().toISOString()
        }
      }
    }

    // 返回公共词汇列表
    const result = await vocabularyService.getVocabularyList({
      categoryId: validatedQuery.categoryId,
      difficulty: validatedQuery.difficulty,
      search: validatedQuery.search,
      page: validatedQuery.page,
      limit: validatedQuery.limit
    })

    return {
      success: true,
      data: result,
      meta: {
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        },
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('获取词汇列表失败:', error)

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: '查询参数验证失败',
        data: {
          errors: error.errors
        }
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: '获取词汇列表失败'
    })
  }
})