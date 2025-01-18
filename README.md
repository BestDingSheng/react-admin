### 项目概述
这是一个基于 React + NestJS 的全栈管理系统项目，采用了现代化的技术栈和最佳实践。

#### 前端技术栈
- React 18
- TypeScript
- Ant Design 5.x
- Zustand (状态管理)
- React Router DOM 6
- Axios
- Vite 4.x

#### 后端技术栈
- NestJS 10.x
- TypeORM
- MySQL
- JWT 认证
- Class Validator
- Swagger API 文档

### 主要功能
1. 用户认证与授权
   - 登录/注册
   - JWT token 认证
   - 路由权限控制
   - 403/404 页面处理

2. 用户管理
   - 用户列表展示
   - 创建/编辑用户
   - 分配角色权限
   - 用户状态管理（启用/禁用）

3. 角色管理
   - 角色列表展示
   - 创建/编辑角色
   - 菜单权限分配（树形结构）
   - 角色状态管理

4. 菜单管理
   - 树形菜单展示
   - 创建/编辑/删除菜单
   - 菜单图标配置（支持 Ant Design 图标）
   - 菜单排序和状态管理

5. 系统功能
   - 响应式布局设计
   - 动态路由权限控制
   - 全局状态管理
   - 统一的错误处理
   - Docker 部署支持

### 开发环境要求
- Node.js >= 18
- MySQL >= 8.0
- npm 或 yarn

### 快速开始

1. **克隆项目**
```bash
git clone <项目地址>
cd <项目目录>
```

2. **后端配置**
```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
# 创建 .env 文件并配置以下内容：
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
JWT_SECRET=your_jwt_secret

# 启动开发服务器
npm run start:dev
```

3. **前端配置**
```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
# .env.development 已包含开发环境配置

# 启动开发服务器
npm run dev
```

4. **访问地址**
- 前端开发服务器: http://localhost:5173
- 后端API服务器: http://localhost:3000
- API文档: http://localhost:3000/api

### 项目结构
```
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── layout/        # 布局组件
│   │   ├── pages/         # 页面组件
│   │   ├── router/        # 路由配置
│   │   ├── services/      # API 服务
│   │   ├── stores/        # 状态管理
│   │   ├── types/         # TypeScript 类型定义
│   │   └── utils/         # 工具函数
│   └── ...配置文件
│
└── backend/                # 后端项目
    ├── src/
    │   ├── auth/          # 认证模块
    │   ├── users/         # 用户模块
    │   ├── roles/         # 角色模块
    │   ├── menus/         # 菜单模块
    │   └── common/        # 公共模块
    └── ...配置文件
```

### Docker 部署
项目支持 Docker 部署，包含以下文件：
- Dockerfile: 前端构建镜像
- Dockerfile.nginx: 前端服务器镜像
- docker-compose.yml: 容器编排配置
- nginx.conf: Nginx 服务器配置

### 开发规范
1. **代码规范**
   - 使用 ESLint + Prettier 进行代码格式化
   - 遵循 TypeScript 类型检查
   - 使用绝对路径导入（@/）

2. **提交规范**
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档修改
   - style: 代码格式修改
   - refactor: 代码重构
   - test: 测试用例修改
   - chore: 其他修改

3. **分支管理**
   - main: 主分支
   - develop: 开发分支
   - feature/*: 功能分支
   - hotfix/*: 紧急修复分支

### 注意事项
1. 确保 MySQL 服务正常运行
2. 前端开发时注意配置 API 代理
3. 后端开发时注意数据库迁移
4. 注意保持代码格式统一
5. 定期更新依赖包版本
