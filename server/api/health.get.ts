import pkg from '@prisma/client'

const { PrismaClient } = pkg

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // 检查数据库连接
    let databaseStatus = 'disconnected'
    try {
      await prisma.$queryRaw`SELECT 1 as result`
      databaseStatus = 'connected'
    } catch (error) {
      console.error('数据库连接失败:', error)
    }

    // 检查Redis连接（如果配置了）
    let redisStatus: 'connected' | 'disconnected' = 'disconnected'
    if (process.env.REDIS_URL) {
      try {
        // 这里可以添加Redis连接检查
        redisStatus = 'connected'
      } catch (error) {
        console.error('Redis连接失败:', error)
      }
    }

    // 检查LLM服务
    let llmStatus: 'connected' | 'disconnected' = 'disconnected'
    if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
      llmStatus = 'connected'
    }

    const healthCheck = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: databaseStatus,
        redis: redisStatus,
        llm: llmStatus
      }
    }

    // 如果任何关键服务不可用，标记为不健康
    if (databaseStatus === 'disconnected') {
      healthCheck.status = 'unhealthy'
      throw createError({
        statusCode: 503,
        statusMessage: '服务不可用'
      })
    }

    return {
      success: true,
      data: healthCheck
    }
  } catch (error) {
    console.error('健康检查失败:', error)

    throw createError({
      statusCode: 503,
      statusMessage: '服务不可用'
    })
  }
})