// LLM相关类型定义

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'local'
  apiKey?: string
  model: string
  maxTokens: number
  temperature: number
  timeout: number
}

export interface LLMRequest {
  prompt: string
  context?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

export interface LLMResponse {
  success: boolean
  content?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
  provider: string
  model: string
}

export interface VocabularyGenerationRequest {
  topic?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  count: number
  includeExamples: boolean
}

export interface TranslationRequest {
  text: string
  from: string
  to: string
  context?: string
}

export interface TranslationResponse {
  translatedText: string
  confidence?: number
  alternatives?: string[]
}

export interface GrammarCheckRequest {
  text: string
  language?: string
}

export interface GrammarCheckResponse {
  originalText: string
  correctedText: string
  corrections: {
    original: string
    corrected: string
    type: 'spelling' | 'grammar' | 'style'
    position: {
      start: number
      end: number
    }
    explanation?: string
  }[]
  score: number // 0-100
}

export interface ReadingComprehensionRequest {
  article: string
  questionCount: number
  difficulty: number
}

export interface ReadingComprehensionResponse {
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    explanation?: string
  }[]
  difficulty: number
}