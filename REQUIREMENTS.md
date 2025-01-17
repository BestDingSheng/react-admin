# React Admin 后台管理系统需求文档

## 1. 项目概述

### 1.1 项目背景
本项目是一个基于 React + NestJS 的现代化后台管理系统，旨在提供一个安全、高效、易用的企业级管理平台。

### 1.2 技术栈
#### 前端
- React 18 + TypeScript
- Ant Design 5.x UI 框架
- Zustand 状态管理
- React Router DOM 6
- Axios 请求库
- Vite 构建工具

#### 后端
- NestJS + TypeScript
- TypeORM
- MySQL 数据库
- JWT 认证
- Swagger API 文档

## 2. 功能需求

### 2.1 用户认证与授权
#### 2.1.1 用户认证
- 用户注册
  - 用户名、邮箱注册
  - 密码加密存储（bcrypt）
  - 重复注册校验
- 用户登录
  - 用户名/密码登录
  - JWT token 认证
  - 统一的响应格式
    ```typescript
    {
      code: number;    // 0: 成功, 20001+: 业务错误
      message: string; // 提示信息
      result: any;     // 返回数据
    }
    ```

#### 2.1.2 权限控制
- 路由权限
  - 基于角色的路由控制
  - 未授权路由重定向到 403 页面
  - 动态路由生成
- 菜单权限
  - 基于角色的菜单显示
  - 动态加载菜单项
  - 权限缓存优化

### 2.2 用户管理模块
#### 2.2.1 用户列表
- 查询功能
  - 支持用户名、邮箱筛选
  - 分页显示
  - 状态筛选
- 用户操作
  - 创建用户
  - 编辑用户信息
  - 删除用户
  - 修改用户状态
  - 分配角色

### 2.3 角色管理模块
#### 2.3.1 角色管理
- 角色操作
  - 创建角色
  - 编辑角色信息
  - 删除角色
  - 角色列表查询
- 权限分配
  - 为角色分配菜单权限
  - 权限预览
  - 权限更新

### 2.4 菜单管理模块
#### 2.4.1 菜单管理
- 菜单结构
  - 树形展示
  - 多级菜单支持
  - 排序功能
- 菜单配置
  - 图标设置
  - 路由配置
  - 组件配置
  - 菜单类型（目录/菜单/按钮）

### 2.5 系统功能
- 布局功能
  - 响应式侧边栏
  - 顶部导航栏
  - 面包屑导航
  - 全局 Loading
- 错误处理
  - 统一的错误提示
  - 403/404 页面
  - 网络错误处理

## 3. 技术实现

### 3.1 后端实现
#### 3.1.1 核心模块
- AppModule: 应用程序根模块
- AuthModule: 认证和授权
- UsersModule: 用户管理
- RolesModule: 角色管理
- MenusModule: 菜单管理
- CommonModule: 公共功能（拦截器、过滤器等）

#### 3.1.2 数据模型
- User 实体
  ```typescript
  {
    id: number;
    username: string;
    email: string;
    password: string;
    isActive: boolean;
    roles: Role[];
  }
  ```
- Role 实体
  ```typescript
  {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    menus: Menu[];
  }
  ```
- Menu 实体
  ```typescript
  {
    id: number;
    name: string;
    path: string;
    component: string;
    icon: string;
    sort: number;
    parent: Menu;
    children: Menu[];
  }
  ```

### 3.2 前端实现
#### 3.2.1 状态管理
- Zustand Store
  - AuthStore: 用户认证状态
  - MenuStore: 菜单状态
  - 其他业务状态

#### 3.2.2 路由管理
- 动态路由
- 权限路由
- 路由守卫

#### 3.2.3 组件封装
- 布局组件
- 权限组件
- 业务组件

## 4. 安全措施
- 密码加密（bcrypt）
- JWT token 认证
- 路由权限控制
- 统一的错误处理
- CORS 配置

## 5. 开发规范
### 5.1 代码规范
- ESLint + Prettier
- TypeScript 强类型
- 统一的代码风格

### 5.2 Git 规范
- 分支管理
- 提交信息规范
- 代码审查

### 5.3 API 规范
- RESTful 设计
- 统一的响应格式
- Swagger 文档 