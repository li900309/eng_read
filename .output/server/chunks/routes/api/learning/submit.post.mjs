import { d as defineEventHandler, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { v as vocabularyService } from '../../../_/vocabulary.service.mjs';
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

const submitLearningSchema = z.object({
  vocabularyId: z.string().min(1, "\u8BCD\u6C47ID\u4E0D\u80FD\u4E3A\u7A7A"),
  isCorrect: z.boolean(),
  responseTime: z.number().min(0, "\u54CD\u5E94\u65F6\u95F4\u4E0D\u80FD\u4E3A\u8D1F\u6570")
});
const submit_post = defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth;
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u9700\u8981\u7528\u6237\u8BA4\u8BC1"
      });
    }
    const body = await readBody(event);
    const validatedData = submitLearningSchema.parse(body);
    const result = await vocabularyService.updateUserVocabulary(
      auth.id,
      validatedData.vocabularyId,
      validatedData.isCorrect,
      validatedData.responseTime
    );
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("\u63D0\u4EA4\u5B66\u4E60\u8BB0\u5F55\u5931\u8D25:", error);
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
      statusMessage: error instanceof Error ? error.message : "\u63D0\u4EA4\u5B66\u4E60\u8BB0\u5F55\u5931\u8D25"
    });
  }
});

export { submit_post as default };
//# sourceMappingURL=submit.post.mjs.map
