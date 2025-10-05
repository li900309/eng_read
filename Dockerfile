# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 生成Prisma客户端
RUN npx prisma generate

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtdoc

# 设置工作目录
WORKDIR /app

# 复制必要文件
COPY --from=builder --chown=nuxtdoc:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxtdoc:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nuxtdoc:nodejs /app/node_modules ./node_modules

# 切换到非root用户
USER nuxtdoc

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node .output/server/api/health.js || exit 1

# 启动命令
CMD ["node", ".output/server/index.mjs"]