### 项目概述
这是一个基于 React + NestJS 的全栈管理系统项目，采用了现代化的技术栈和最佳实践。

#### 前端技术栈
- React 18
- TypeScript
- Ant Design 5.x
- Zustand (状态管理)
- React Router DOM
- Axios
- Styled Components
- Vite (构建工具)

#### 后端技术栈
- NestJS
- TypeORM
- PostgreSQL
- JWT 认证
- Class Validator
- Swagger API 文档

### 主要功能
1. 用户认证
   - 登录
   - 注册
   - JWT token 认证
   - 自动登录

2. 布局系统
   - 响应式侧边栏
   - 顶部用户信息
   - 路由管理

3. Dashboard
   - 数据统计展示
   - 图表展示
   - 实时数据更新

### 在新电脑上运行项目的步骤

1. **环境准备**
```bash
# 安装 Node.js (建议使用 v18 或更高版本)
# 安装 PostgreSQL 数据库
```

2. **克隆项目**
```bash
git clone <项目仓库地址>
cd <项目目录>
```

3. **后端设置**
```bash
cd backend

# 安装依赖
npm install

# 配置数据库
# 创建 .env 文件，添加以下配置：
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=你的数据库用户名
DB_PASSWORD=你的数据库密码
DB_DATABASE=你的数据库名
JWT_SECRET=你的jwt密钥

# 启动后端服务
npm run start:dev
```

4. **前端设置**
```bash
cd frontend

# 安装依赖
npm install

# 启动前端服务
npm run dev
```

5. **访问项目**
- 前端: http://localhost:5173
- 后端 API: http://localhost:3000/api
- Swagger 文档: http://localhost:3000/api/docs

### 注意事项
1. 确保 PostgreSQL 数据库已经启动
2. 确保后端的 `.env` 文件配置正确
3. 如果遇到 CORS 问题，检查后端配置
4. 前端的 API 地址配置在 `frontend/src/utils/request.ts` 中，如果需要修改后端地址，请更新这里

### 项目结构
```
├── backend/                # 后端项目
│   ├── src/
│   │   ├── auth/          # 认证模块
│   │   ├── users/         # 用户模块
│   │   └── main.ts        # 入口文件
│   └── package.json
│
└── frontend/              # 前端项目
    ├── src/
    │   ├── components/    # 组件
    │   ├── pages/         # 页面
    │   ├── stores/        # 状态管理
    │   ├── utils/         # 工具函数
    │   └── App.tsx        # 入口组件
    └── package.json
```

### 可扩展功能
1. 用户权限管理
2. 更多的数据展示页面
3. 主题切换
4. 国际化支持
5. 更多的数据图表
6. 文件上传功能

如果你需要添加新功能或者遇到任何问题，都可以继续问我。
