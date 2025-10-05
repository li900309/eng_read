// 认证相关类型定义

export interface User {
  id: string
  email: string
  username: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  language?: string
  theme?: 'light' | 'dark'
  dailyGoal?: number
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced'
  enableSound?: boolean
  enableAnimations?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface JWTPayload {
  userId: string
  email: string
  username: string
  iat: number
  exp: number
}