import { d as defineEventHandler, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { z } from 'zod';
import { v as vocabularyService } from '../../_/vocabulary.service.mjs';
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

const querySchema = z.object({
  categoryId: z.string().optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  user: z.string().optional()
  // 如果为'true'，返回用户词汇列表
});
const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const validatedQuery = querySchema.parse(query);
    const auth = event.context.auth;
    if (validatedQuery.user === "true" && auth) {
      const result2 = await vocabularyService.getUserVocabularies(auth.id, {
        categoryId: validatedQuery.categoryId,
        difficulty: validatedQuery.difficulty,
        search: validatedQuery.search,
        page: validatedQuery.page,
        limit: validatedQuery.limit
      });
      return {
        success: true,
        data: result2,
        meta: {
          pagination: {
            page: result2.page,
            limit: result2.limit,
            total: result2.total,
            totalPages: result2.totalPages
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
    }
    const result = await vocabularyService.getVocabularyList({
      categoryId: validatedQuery.categoryId,
      difficulty: validatedQuery.difficulty,
      search: validatedQuery.search,
      page: validatedQuery.page,
      limit: validatedQuery.limit
    });
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u8BCD\u6C47\u5217\u8868\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u67E5\u8BE2\u53C2\u6570\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u83B7\u53D6\u8BCD\u6C47\u5217\u8868\u5931\u8D25"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
