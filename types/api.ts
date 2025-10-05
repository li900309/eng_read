// API相关类型定义

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    timestamp: string
  }
}

export interface ApiError {
  statusCode: number
  statusMessage: string
  data?: any
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams {
  query?: string
  filters?: Record<string, any>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: 'connected' | 'disconnected'
    redis?: 'connected' | 'disconnected'
    llm?: 'connected' | 'disconnected'
  }
}