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

const registerSchema = z.object({
  email: z.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
  username: z.string().min(3, "\u7528\u6237\u540D\u81F3\u5C113\u4E2A\u5B57\u7B26").max(20, "\u7528\u6237\u540D\u6700\u591A20\u4E2A\u5B57\u7B26").regex(/^[a-zA-Z0-9_]+$/, "\u7528\u6237\u540D\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u4E0B\u5212\u7EBF"),
  password: z.string().min(8, "\u5BC6\u7801\u81F3\u5C118\u4E2A\u5B57\u7B26").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "\u5BC6\u7801\u5FC5\u987B\u5305\u542B\u5927\u5C0F\u5199\u5B57\u6BCD\u548C\u6570\u5B57"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4",
  path: ["confirmPassword"]
});
const register_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = registerSchema.parse(body);
    const result = await authService.register(validatedData);
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
    console.error("\u6CE8\u518C\u5931\u8D25:", error);
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
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : "\u6CE8\u518C\u5931\u8D25"
    });
  }
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
