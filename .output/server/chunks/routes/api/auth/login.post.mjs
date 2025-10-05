import { d as defineEventHandler, r as readBody, a as authService, s as setCookie, c as createError } from '../../../nitro/nitro.mjs';
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

const loginSchema = z.object({
  email: z.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
  password: z.string().min(6, "\u5BC6\u7801\u81F3\u5C116\u4E2A\u5B57\u7B26")
});
const login_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = loginSchema.parse(body);
    const result = await authService.login(validatedData);
    setCookie(event, "auth-token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      // 7天
      path: "/"
    });
    return {
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    };
  } catch (error) {
    console.error("\u767B\u5F55\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8F93\u5165\u6570\u636E\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 401,
      statusMessage: error instanceof Error ? error.message : "\u767B\u5F55\u5931\u8D25"
    });
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
