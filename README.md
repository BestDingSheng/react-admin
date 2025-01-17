### 项目概述
这是一个基于 React + NestJS 的全栈管理系统项目，采用了现代化的技术栈和最佳实践。

#### 前端技术栈
- React 18
- TypeScript
- Ant Design 5.x
- Zustand (状态管理)
- React Router DOM 6
- Axios
- Vite (构建工具)

#### 后端技术栈
- NestJS
- TypeORM
- MySQL
- JWT 认证
- Class Validator
- Swagger API 文档

### 主要功能
1. 用户认证与授权
   - 登录/注册
   - JWT token 认证
   - 自动登录
   - 路由权限控制
   - 403 未授权页面

2. 用户管理
   - 用户列表
   - 创建/编辑用户
   - 分配角色
   - 启用/禁用用户

3. 角色管理
   - 角色列表
   - 创建/编辑角色
   - 分配菜单权限
   - 启用/禁用角色

4. 菜单管理
   - 菜单树形展示
   - 创建/编辑菜单
   - 菜单排序
   - 配置图标和路由

5. 布局系统
   - 响应式侧边栏
   - 动态菜单（基于权限）
   - 顶部导航栏
   - Loading 状态管理

### 在新电脑上运行项目的步骤

1. **环境准备**
```bash
# 安装 Node.js (建议使用 v18 或更高版本)
# 安装 MySQL 数据库
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

# 配置数据库连接
# 修改 src/app.module.ts 中的数据库配置：
type: 'mysql',
host: 'localhost',
port: 3306,
username: '你的数据库用户名',
password: '你的数据库密码',
database: '你的数据库名',

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
- Swagger 文档: http://localhost:3000/api

### 项目特点
1. 统一的响应格式
   ```typescript
   {
     code: number;    // 0: 成功, 20001+: 业务错误
     message: string; // 提示信息
     result: any;     // 返回数据
   }
   ```

2. 完整的权限控制
   - 基于角色的菜单权限
   - 动态路由权限控制
   - 未授权页面重定向

3. 用户友好的界面
   - 全局 Loading 状态
   - 统一的错误处理
   - 响应式布局

### 项目结构
```
├── backend/                # 后端项目
│   ├── src/
│   │   ├── auth/          # 认证模块
│   │   ├── users/         # 用户模块
│   │   ├── roles/         # 角色模块
│   │   ├── menus/         # 菜单模块
│   │   └── common/        # 公共模块（拦截器、过滤器等）
│   └── package.json
│
└── frontend/              # 前端项目
    ├── src/
    │   ├── components/    # 公共组件
    │   ├── pages/         # 页面
    │   ├── stores/        # 状态管理
    │   ├── services/      # API 服务
    │   ├── router/        # 路由配置
    │   ├── layout/        # 布局组件
    │   └── utils/         # 工具函数
    └── package.json
```

### 开发规范
1. 代码规范
   - ESLint + Prettier 代码格式化
   - TypeScript 类型检查
   - 统一的代码风格

2. Git 规范
   - 功能分支开发
   - 提交信息规范
   - 代码审查流程

3. API 规范
   - RESTful API 设计
   - Swagger 文档
   - 统一的错误处理

### 注意事项
1. 确保 MySQL 数据库已经启动
2. 检查数据库连接配置
3. 前端 API 地址配置在环境变量中
4. 开发时注意保持代码格式统一
