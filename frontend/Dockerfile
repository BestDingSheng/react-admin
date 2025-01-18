# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine as production

WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.cjs .
COPY --from=builder /app/proxy.config.cjs .
COPY --from=builder /app/proxy.config.d.cts .
COPY --from=builder /app/.env.production .
COPY package*.json ./

# 只安装生产环境依赖
RUN npm ci --only=production

EXPOSE 5173

# 启动服务
CMD ["node", "server.cjs"] 