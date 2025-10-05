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

const addVocabularySchema = z.object({
  vocabularyId: z.string().min(1, "\u8BCD\u6C47ID\u4E0D\u80FD\u4E3A\u7A7A")
});
const add_post = defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth;
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u9700\u8981\u7528\u6237\u8BA4\u8BC1"
      });
    }
    const body = await readBody(event);
    const validatedData = addVocabularySchema.parse(body);
    const result = await vocabularyService.addVocabularyToUser(
      auth.id,
      validatedData.vocabularyId
    );
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("\u6DFB\u52A0\u8BCD\u6C47\u5931\u8D25:", error);
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
      statusMessage: error instanceof Error ? error.message : "\u6DFB\u52A0\u8BCD\u6C47\u5931\u8D25"
    });
  }
});

export { add_post as default };
//# sourceMappingURL=add.post.mjs.map
