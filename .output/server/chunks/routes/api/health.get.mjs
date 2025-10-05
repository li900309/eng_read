import { d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
import pkg from '@prisma/client';
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
import '@iconify/utils';
import 'consola';
import 'ipx';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const health_get = defineEventHandler(async (event) => {
  try {
    let databaseStatus = "disconnected";
    try {
      await prisma.$queryRaw`SELECT 1 as result`;
      databaseStatus = "connected";
    } catch (error) {
      console.error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25:", error);
    }
    let redisStatus = "disconnected";
    if (process.env.REDIS_URL) {
      try {
        redisStatus = "connected";
      } catch (error) {
        console.error("Redis\u8FDE\u63A5\u5931\u8D25:", error);
      }
    }
    let llmStatus = "disconnected";
    if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
      llmStatus = "connected";
    }
    const healthCheck = {
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0",
      services: {
        database: databaseStatus,
        redis: redisStatus,
        llm: llmStatus
      }
    };
    if (databaseStatus === "disconnected") {
      healthCheck.status = "unhealthy";
      throw createError({
        statusCode: 503,
        statusMessage: "\u670D\u52A1\u4E0D\u53EF\u7528"
      });
    }
    return {
      success: true,
      data: healthCheck
    };
  } catch (error) {
    console.error("\u5065\u5EB7\u68C0\u67E5\u5931\u8D25:", error);
    throw createError({
      statusCode: 503,
      statusMessage: "\u670D\u52A1\u4E0D\u53EF\u7528"
    });
  }
});

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map
