import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'bcryptjs';
import 'jsonwebtoken';
import '@prisma/client';
import '@iconify/utils';
import 'consola';
import 'ipx';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class LLMService {
  constructor() {
    __publicField(this, "configs", /* @__PURE__ */ new Map());
    this.initializeConfigs();
  }
  /**
   * 初始化LLM配置
   */
  initializeConfigs() {
    if (process.env.OPENAI_API_KEY) {
      this.configs.set("openai", {
        provider: "openai",
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-3.5-turbo",
        maxTokens: 2e3,
        temperature: 0.7,
        timeout: 3e4
      });
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.configs.set("anthropic", {
        provider: "anthropic",
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: "claude-3-haiku-20240307",
        maxTokens: 2e3,
        temperature: 0.7,
        timeout: 3e4
      });
    }
    this.configs.set("local", {
      provider: "local",
      model: "llama3.1:8b",
      maxTokens: 2e3,
      temperature: 0.7,
      timeout: 6e4
    });
  }
  /**
   * 生成词汇
   */
  async generateVocabulary(request) {
    const prompt = this.buildVocabularyPrompt(request);
    return await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u82F1\u8BED\u6559\u80B2\u4E13\u5BB6\uFF0C\u64C5\u957F\u751F\u6210\u9002\u5408\u4E0D\u540C\u6C34\u5E73\u7684\u82F1\u8BED\u8BCD\u6C47\u5B66\u4E60\u5185\u5BB9\u3002",
      maxTokens: 1500,
      temperature: 0.6
    });
  }
  /**
   * 翻译文本
   */
  async translate(request) {
    let prompt = `\u8BF7\u5C06\u4EE5\u4E0B\u6587\u672C\u4ECE${request.from}\u7FFB\u8BD1\u5230${request.to}\uFF1A

"${request.text}"`;
    if (request.context) {
      prompt += `

\u4E0A\u4E0B\u6587\uFF1A${request.context}`;
    }
    const response = await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u7FFB\u8BD1\u4E13\u5BB6\uFF0C\u8BF7\u63D0\u4F9B\u51C6\u786E\u3001\u81EA\u7136\u7684\u7FFB\u8BD1\u3002",
      maxTokens: 500,
      temperature: 0.3
    });
    if (!response.success || !response.content) {
      return {
        translatedText: "",
        error: response.error || "\u7FFB\u8BD1\u5931\u8D25"
      };
    }
    return {
      translatedText: response.content.trim(),
      confidence: 0.9
    };
  }
  /**
   * 语法检查
   */
  async checkGrammar(request) {
    const prompt = `\u8BF7\u68C0\u67E5\u4EE5\u4E0B\u82F1\u6587\u6587\u672C\u7684\u8BED\u6CD5\u3001\u62FC\u5199\u548C\u8868\u8FBE\u95EE\u9898\uFF1A

"${request.text}"

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\u7ED3\u679C\uFF0C\u5305\u542B\uFF1A
1. correctedText: \u4FEE\u6B63\u540E\u7684\u6587\u672C
2. corrections: \u9519\u8BEF\u5217\u8868\uFF0C\u6BCF\u4E2A\u9519\u8BEF\u5305\u542Boriginal, corrected, type, position, explanation
3. score: \u6574\u4F53\u8BC4\u5206(0-100)`;
    const response = await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u82F1\u8BED\u8BED\u6CD5\u68C0\u67E5\u5DE5\u5177\uFF0C\u8BF7\u4ED4\u7EC6\u68C0\u67E5\u6587\u672C\u5E76\u63D0\u4F9B\u51C6\u786E\u7684\u4FEE\u6B63\u5EFA\u8BAE\u3002",
      maxTokens: 1e3,
      temperature: 0.1
    });
    if (!response.success || !response.content) {
      return {
        originalText: request.text,
        correctedText: request.text,
        corrections: [],
        score: 100
      };
    }
    try {
      const result = JSON.parse(response.content.trim());
      return result;
    } catch (error) {
      console.error("\u89E3\u6790\u8BED\u6CD5\u68C0\u67E5\u7ED3\u679C\u5931\u8D25:", error);
      return {
        originalText: request.text,
        correctedText: request.text,
        corrections: [],
        score: 100
      };
    }
  }
  /**
   * 生成阅读理解题
   */
  async generateReadingComprehension(request) {
    const prompt = `\u57FA\u4E8E\u4EE5\u4E0B\u6587\u7AE0\u751F\u6210${request.questionCount}\u9053\u9605\u8BFB\u7406\u89E3\u9898\uFF1A

"${request.article}"

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u5305\u542B\uFF1A
1. questions: \u95EE\u9898\u5217\u8868\uFF0C\u6BCF\u4E2A\u95EE\u9898\u5305\u542Bid, question, options(4\u4E2A\u9009\u9879), correctAnswer, explanation`;
    const response = await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u9605\u8BFB\u7406\u89E3\u51FA\u9898\u4E13\u5BB6\uFF0C\u8BF7\u751F\u6210\u9AD8\u8D28\u91CF\u7684\u9605\u8BFB\u7406\u89E3\u9898\u76EE\u3002",
      maxTokens: 2e3,
      temperature: 0.4
    });
    if (!response.success || !response.content) {
      return {
        questions: [],
        difficulty: request.difficulty
      };
    }
    try {
      const result = JSON.parse(response.content.trim());
      return {
        ...result,
        difficulty: request.difficulty
      };
    } catch (error) {
      console.error("\u89E3\u6790\u9605\u8BFB\u7406\u89E3\u9898\u76EE\u5931\u8D25:", error);
      return {
        questions: [],
        difficulty: request.difficulty
      };
    }
  }
  /**
   * 通用LLM请求
   */
  async makeRequest(request) {
    const config = this.getBestConfig();
    if (!config) {
      return {
        success: false,
        error: "\u6CA1\u6709\u53EF\u7528\u7684LLM\u670D\u52A1\u914D\u7F6E",
        provider: "none",
        model: "none"
      };
    }
    try {
      switch (config.provider) {
        case "openai":
          return await this.callOpenAI(config, request);
        case "anthropic":
          return await this.callAnthropic(config, request);
        case "local":
          return await this.callLocal(config, request);
        default:
          return {
            success: false,
            error: `\u4E0D\u652F\u6301\u7684LLM\u63D0\u4F9B\u5546: ${config.provider}`,
            provider: config.provider,
            model: config.model
          };
      }
    } catch (error) {
      console.error("LLM\u8BF7\u6C42\u5931\u8D25:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF",
        provider: config.provider,
        model: config.model
      };
    }
  }
  /**
   * 调用OpenAI API
   */
  async callOpenAI(config, request) {
    const messages = [];
    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }
    messages.push({ role: "user", content: request.prompt });
    return {
      success: true,
      content: "This is a simulated response from OpenAI. Please install the openai package for actual API calls.",
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      },
      provider: "openai",
      model: config.model
    };
  }
  /**
   * 调用Anthropic API
   */
  async callAnthropic(config, request) {
    return {
      success: true,
      content: "This is a simulated response from Anthropic. Please install the @anthropic-ai/sdk package for actual API calls.",
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      },
      provider: "anthropic",
      model: config.model
    };
  }
  /**
   * 调用本地模型（通过API）
   */
  async callLocal(config, request) {
    try {
      const response = await $fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: {
          model: config.model,
          prompt: request.systemPrompt ? `${request.systemPrompt}

${request.prompt}` : request.prompt,
          stream: false,
          options: {
            temperature: request.temperature || config.temperature,
            num_predict: request.maxTokens || config.maxTokens
          }
        },
        timeout: config.timeout
      });
      return {
        success: true,
        content: response.response,
        provider: "local",
        model: config.model
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672C\u5730\u6A21\u578B\u8C03\u7528\u5931\u8D25",
        provider: "local",
        model: config.model
      };
    }
  }
  /**
   * 获取最佳配置
   */
  getBestConfig() {
    const providers = ["openai", "anthropic", "local"];
    for (const provider of providers) {
      const config = this.configs.get(provider);
      if (config && (config.apiKey || provider === "local")) {
        return config;
      }
    }
    return null;
  }
  /**
   * 构建词汇生成提示词
   */
  buildVocabularyPrompt(request) {
    const difficultyLevels = {
      beginner: "\u521D\u7EA7\u6C34\u5E73",
      intermediate: "\u4E2D\u7EA7\u6C34\u5E73",
      advanced: "\u9AD8\u7EA7\u6C34\u5E73"
    };
    let prompt = `\u8BF7\u751F\u6210${request.count}\u4E2A\u9002\u5408${difficultyLevels[request.difficulty]}\u5B66\u4E60\u8005\u7684\u82F1\u8BED\u8BCD\u6C47\u3002`;
    if (request.topic) {
      prompt += `\u4E3B\u9898\uFF1A${request.topic}\u3002`;
    }
    prompt += `

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u5305\u542B\uFF1A
1. words: \u8BCD\u6C47\u5217\u8868\uFF0C\u6BCF\u4E2A\u8BCD\u6C47\u5305\u542B\uFF1A
   - word: \u5355\u8BCD
   - pronunciation: \u97F3\u6807
   - definition: \u4E2D\u6587\u91CA\u4E49
   - example: \u82F1\u6587\u4F8B\u53E5
   - difficulty: \u96BE\u5EA6\u7B49\u7EA7(1-5)
   - frequency: \u8BCD\u9891\u7B49\u7EA7(1-10)`;
    if (request.includeExamples) {
      prompt += "\n   - category: \u8BCD\u6C47\u5206\u7C7B";
    }
    return prompt;
  }
}
const llmService = new LLMService();

const translateSchema = z.object({
  text: z.string().min(1, "\u7FFB\u8BD1\u6587\u672C\u4E0D\u80FD\u4E3A\u7A7A"),
  from: z.string().min(2, "\u6E90\u8BED\u8A00\u4E0D\u80FD\u4E3A\u7A7A"),
  to: z.string().min(2, "\u76EE\u6807\u8BED\u8A00\u4E0D\u80FD\u4E3A\u7A7A"),
  context: z.string().optional()
});
const translate_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = translateSchema.parse(body);
    const result = await llmService.translate(validatedData);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("\u7FFB\u8BD1\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8BF7\u6C42\u6570\u636E\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "\u7FFB\u8BD1\u5931\u8D25"
    });
  }
});

export { translate_post as default };
//# sourceMappingURL=translate.post.mjs.map
