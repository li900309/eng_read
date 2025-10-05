import type {
  LLMConfig,
  LLMRequest,
  LLMResponse,
  VocabularyGenerationRequest,
  TranslationRequest,
  TranslationResponse,
  GrammarCheckRequest,
  GrammarCheckResponse,
  ReadingComprehensionRequest,
  ReadingComprehensionResponse
} from '~/types/llm'

export class LLMService {
  private configs: Map<string, LLMConfig> = new Map()

  constructor() {
    this.initializeConfigs()
  }

  /**
   * 初始化LLM配置
   */
  private initializeConfigs(): void {
    // OpenAI配置
    if (process.env.OPENAI_API_KEY) {
      this.configs.set('openai', {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-3.5-turbo',
        maxTokens: 2000,
        temperature: 0.7,
        timeout: 30000
      })
    }

    // Anthropic配置
    if (process.env.ANTHROPIC_API_KEY) {
      this.configs.set('anthropic', {
        provider: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: 'claude-3-haiku-20240307',
        maxTokens: 2000,
        temperature: 0.7,
        timeout: 30000
      })
    }

    // 本地模型配置
    this.configs.set('local', {
      provider: 'local',
      model: 'llama3.1:8b',
      maxTokens: 2000,
      temperature: 0.7,
      timeout: 60000
    })
  }

  /**
   * 生成词汇
   */
  async generateVocabulary(request: VocabularyGenerationRequest): Promise<LLMResponse> {
    const prompt = this.buildVocabularyPrompt(request)
    return await this.makeRequest({
      prompt,
      systemPrompt: '你是一个专业的英语教育专家，擅长生成适合不同水平的英语词汇学习内容。',
      maxTokens: 1500,
      temperature: 0.6
    })
  }

  /**
   * 翻译文本
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    let prompt = `请将以下文本从${request.from}翻译到${request.to}：\n\n"${request.text}"`

    if (request.context) {
      prompt += `\n\n上下文：${request.context}`
    }

    const response = await this.makeRequest({
      prompt,
      systemPrompt: '你是一个专业的翻译专家，请提供准确、自然的翻译。',
      maxTokens: 500,
      temperature: 0.3
    })

    if (!response.success || !response.content) {
      return {
        translatedText: '',
        error: response.error || '翻译失败'
      }
    }

    return {
      translatedText: response.content.trim(),
      confidence: 0.9
    }
  }

  /**
   * 语法检查
   */
  async checkGrammar(request: GrammarCheckRequest): Promise<GrammarCheckResponse> {
    const prompt = `请检查以下英文文本的语法、拼写和表达问题：\n\n"${request.text}"\n\n请以JSON格式返回结果，包含：
1. correctedText: 修正后的文本
2. corrections: 错误列表，每个错误包含original, corrected, type, position, explanation
3. score: 整体评分(0-100)`

    const response = await this.makeRequest({
      prompt,
      systemPrompt: '你是一个专业的英语语法检查工具，请仔细检查文本并提供准确的修正建议。',
      maxTokens: 1000,
      temperature: 0.1
    })

    if (!response.success || !response.content) {
      return {
        originalText: request.text,
        correctedText: request.text,
        corrections: [],
        score: 100
      }
    }

    try {
      const result = JSON.parse(response.content.trim())
      return result
    } catch (error) {
      console.error('解析语法检查结果失败:', error)
      return {
        originalText: request.text,
        correctedText: request.text,
        corrections: [],
        score: 100
      }
    }
  }

  /**
   * 生成阅读理解题
   */
  async generateReadingComprehension(request: ReadingComprehensionRequest): Promise<ReadingComprehensionResponse> {
    const prompt = `基于以下文章生成${request.questionCount}道阅读理解题：\n\n"${request.article}"\n\n请以JSON格式返回，包含：
1. questions: 问题列表，每个问题包含id, question, options(4个选项), correctAnswer, explanation`

    const response = await this.makeRequest({
      prompt,
      systemPrompt: '你是一个专业的阅读理解出题专家，请生成高质量的阅读理解题目。',
      maxTokens: 2000,
      temperature: 0.4
    })

    if (!response.success || !response.content) {
      return {
        questions: [],
        difficulty: request.difficulty
      }
    }

    try {
      const result = JSON.parse(response.content.trim())
      return {
        ...result,
        difficulty: request.difficulty
      }
    } catch (error) {
      console.error('解析阅读理解题目失败:', error)
      return {
        questions: [],
        difficulty: request.difficulty
      }
    }
  }

  /**
   * 通用LLM请求
   */
  private async makeRequest(request: LLMRequest): Promise<LLMResponse> {
    const config = this.getBestConfig()
    if (!config) {
      return {
        success: false,
        error: '没有可用的LLM服务配置',
        provider: 'none',
        model: 'none'
      }
    }

    try {
      switch (config.provider) {
        case 'openai':
          return await this.callOpenAI(config, request)
        case 'anthropic':
          return await this.callAnthropic(config, request)
        case 'local':
          return await this.callLocal(config, request)
        default:
          return {
            success: false,
            error: `不支持的LLM提供商: ${config.provider}`,
            provider: config.provider,
            model: config.model
          }
      }
    } catch (error) {
      console.error('LLM请求失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        provider: config.provider,
        model: config.model
      }
    }
  }

  /**
   * 调用OpenAI API
   */
  private async callOpenAI(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    // 这里简化实现，实际使用时需要安装openai包
    // import OpenAI from 'openai'
    // const openai = new OpenAI({ apiKey: config.apiKey })

    const messages = []
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt })
    }
    messages.push({ role: 'user', content: request.prompt })

    // 模拟响应
    return {
      success: true,
      content: 'This is a simulated response from OpenAI. Please install the openai package for actual API calls.',
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      },
      provider: 'openai',
      model: config.model
    }
  }

  /**
   * 调用Anthropic API
   */
  private async callAnthropic(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    // 这里简化实现，实际使用时需要安装@anthropic-ai/sdk包
    // import Anthropic from '@anthropic-ai/sdk'
    // const anthropic = new Anthropic({ apiKey: config.apiKey })

    // 模拟响应
    return {
      success: true,
      content: 'This is a simulated response from Anthropic. Please install the @anthropic-ai/sdk package for actual API calls.',
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      },
      provider: 'anthropic',
      model: config.model
    }
  }

  /**
   * 调用本地模型（通过API）
   */
  private async callLocal(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await $fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        body: {
          model: config.model,
          prompt: request.systemPrompt ? `${request.systemPrompt}\n\n${request.prompt}` : request.prompt,
          stream: false,
          options: {
            temperature: request.temperature || config.temperature,
            num_predict: request.maxTokens || config.maxTokens
          }
        },
        timeout: config.timeout
      })

      return {
        success: true,
        content: response.response,
        provider: 'local',
        model: config.model
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '本地模型调用失败',
        provider: 'local',
        model: config.model
      }
    }
  }

  /**
   * 获取最佳配置
   */
  private getBestConfig(): LLMConfig | null {
    // 优先级：OpenAI > Anthropic > 本地模型
    const providers = ['openai', 'anthropic', 'local']

    for (const provider of providers) {
      const config = this.configs.get(provider)
      if (config && (config.apiKey || provider === 'local')) {
        return config
      }
    }

    return null
  }

  /**
   * 构建词汇生成提示词
   */
  private buildVocabularyPrompt(request: VocabularyGenerationRequest): string {
    const difficultyLevels = {
      beginner: '初级水平',
      intermediate: '中级水平',
      advanced: '高级水平'
    }

    let prompt = `请生成${request.count}个适合${difficultyLevels[request.difficulty]}学习者的英语词汇。`

    if (request.topic) {
      prompt += `主题：${request.topic}。`
    }

    prompt += `\n\n请以JSON格式返回，包含：
1. words: 词汇列表，每个词汇包含：
   - word: 单词
   - pronunciation: 音标
   - definition: 中文释义
   - example: 英文例句
   - difficulty: 难度等级(1-5)
   - frequency: 词频等级(1-10)`

    if (request.includeExamples) {
      prompt += '\n   - category: 词汇分类'
    }

    return prompt
  }
}

// 导出单例
export const llmService = new LLMService()