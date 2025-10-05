import { d as defineEventHandler, b as deleteCookie, c as createError } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  try {
    deleteCookie(event, "auth-token", {
      path: "/"
    });
    return {
      success: true,
      data: {
        message: "\u9000\u51FA\u767B\u5F55\u6210\u529F"
      }
    };
  } catch (error) {
    console.error("\u9000\u51FA\u767B\u5F55\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "\u9000\u51FA\u767B\u5F55\u5931\u8D25"
    });
  }
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
