import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
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

const progress_get = defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth;
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u9700\u8981\u7528\u6237\u8BA4\u8BC1"
      });
    }
    const progress = await vocabularyService.getUserLearningProgress(auth.id);
    return {
      success: true,
      data: progress
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u5B66\u4E60\u8FDB\u5EA6\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "\u83B7\u53D6\u5B66\u4E60\u8FDB\u5EA6\u5931\u8D25"
    });
  }
});

export { progress_get as default };
//# sourceMappingURL=progress.get.mjs.map
