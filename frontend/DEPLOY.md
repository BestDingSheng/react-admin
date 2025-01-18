# 前端项目部署指南

本项目支持两种部署方式：Node.js 方式和 Nginx 方式。推荐使用 Nginx 方式进行生产环境部署。

## 一、Nginx 方式部署（推荐）

### 1. 构建 Docker 镜像
```bash
# 在项目根目录下执行
docker build -f Dockerfile.nginx -t frontend-nginx .
```

### 2. 运行容器
根据不同环境，可以通过环境变量配置后端服务地址：

```bash
# 测试环境
docker run -d \
  -p 80:80 \
  -e BACKEND_API_URL=http://test-api.example.com \
  -e BACKEND_WS_URL=ws://test-ws.example.com \
  frontend-nginx

# 预发布环境
docker run -d \
  -p 80:80 \
  -e BACKEND_API_URL=http://staging-api.example.com \
  -e BACKEND_WS_URL=ws://staging-ws.example.com \
  frontend-nginx

# 生产环境
docker run -d \
  -p 80:80 \
  -e BACKEND_API_URL=http://api.example.com \
  -e BACKEND_WS_URL=ws://ws.example.com \
  frontend-nginx
```

### 3. 环境变量说明
- `BACKEND_API_URL`: 后端 API 服务地址
- `BACKEND_WS_URL`: WebSocket 服务地址（如果不需要可以不设置）

### 4. 配置说明
- Nginx 配置模板位于 `nginx.conf.template`
- 支持 gzip 压缩
- 配置了静态资源缓存
- 配置了基本的安全响应头
- 支持 WebSocket 代理
- 支持前端路由（HTML5 History 模式）

## 二、Node.js 方式部署（不推荐）

### 1. 构建 Docker 镜像
```bash
# 在项目根目录下执行
docker build -t frontend .
```

### 2. 运行容器
```bash
docker run -d \
  -p 5173:5173 \
  -e VITE_API_URL=http://your-backend-url \
  -e NODE_ENV=production \
  frontend
```

## 三、直接部署（不使用 Docker）

### 1. 构建项目
```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

### 2. 使用 Node.js 部署
```bash
# 安装生产环境依赖
npm ci --only=production

# 启动服务
node server.cjs
```

### 3. 使用 Nginx 部署
1. 将 `dist` 目录下的文件复制到 Nginx 的静态文件目录
2. 参考 `nginx.conf.template` 配置你的 Nginx

## 四、注意事项

### 1. SSL 证书
生产环境强烈建议配置 SSL 证书。可以：
- 在 Nginx 层配置 SSL
- 使用负载均衡器配置 SSL
- 使用 CDN 配置 SSL

### 2. 性能优化
- 已配置 gzip 压缩
- 已配置静态资源缓存
- 可根据需要调整缓存策略

### 3. 安全配置
- 已配置基本的安全响应头
- 生产环境建议额外配置：
  - CSP (Content Security Policy)
  - HSTS
  - 更严格的 CORS 策略

### 4. 监控和日志
- Nginx 访问日志位于 `/var/log/nginx/access.log`
- 错误日志位于 `/var/log/nginx/error.log`
- 建议配置日志轮转
- 建议接入监控系统

## 五、常见问题

### 1. 跨域问题
- 已在 Nginx 配置中处理了跨域问题
- 如果还有跨域问题，检查：
  - 后端 CORS 配置
  - Nginx 代理配置
  - 请求头设置

### 2. WebSocket 连接问题
- 确保 `BACKEND_WS_URL` 配置正确
- 检查防火墙配置
- 检查负载均衡器配置

### 3. 路由问题
- 已配置支持 HTML5 History 模式
- 所有路由都会重定向到 index.html
- 404 页面需要在前端路由中处理 