import { MockMethod } from 'vite-plugin-mock';

interface User {
  id: number;
  username: string;
  email: string;
  roles: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  permissions: string[];
  isActive: boolean;
}

interface TokenUsers {
  [key: string]: User;
}

const tokens = {
  admin: 'admin-token',
  user: 'user-token',
};

const users: TokenUsers = {
  'admin-token': {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    roles: [
      { id: 1, name: '管理员', code: 'admin' }
    ],
    permissions: ['*'],
    isActive: true,
  },
  'user-token': {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    roles: [
      { id: 2, name: '普通用户', code: 'user' }
    ],
    permissions: ['view'],
    isActive: true,
  },
};

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body;

      if (username === 'admin' && password === 'admin123') {
        return {
          code: 0,
          result: {
            access_token: tokens.admin,
            user: users['admin-token'],
          },
          message: '登录成功',
        };
      }

      if (username === 'user' && password === 'user123') {
        return {
          code: 0,
          result: {
            access_token: tokens.user,
            user: users['user-token'],
          },
          message: '登录成功',
        };
      }

      return {
        code: 401,
        message: '用户名或密码错误',
      };
    },
  },
  {
    url: '/api/auth/current',
    method: 'get',
    response: ({ headers }: { headers: { authorization?: string } }) => {
      const token = headers.authorization?.replace('Bearer ', '');
      
      if (!token || !users[token]) {
        return {
          code: 401,
          message: '未登录或 token 已过期',
        };
      }

      return {
        code: 0,
        result: {
          user: users[token],
          menus: [
            {
              path: '/dashboard',
              name: '仪表盘',
            },
            {
              path: '/system',
              name: '系统管理',
              children: [
                {
                  path: '/system/user',
                  name: '用户管理',
                },
                {
                  path: '/system/role',
                  name: '角色管理',
                },
                {
                  path: '/system/menu',
                  name: '菜单管理',
                },
              ],
            },
          ],
        },
        message: '获取成功',
      };
    },
  },
  {
    url: '/api/auth/register',
    method: 'post',
    response: ({ body }: { body: { username: string; email: string } }) => {
      const { username, email } = body;
      
      // 模拟用户名已存在的情况
      if (username === 'admin' || username === 'user') {
        return {
          code: 409,
          message: '用户名已存在',
        };
      }

      return {
        code: 0,
        result: {
          id: Math.floor(Math.random() * 1000) + 3,
          username,
          email,
          roles: [{ id: 2, name: '普通用户', code: 'user' }],
          isActive: true,
        },
        message: '注册成功',
      };
    },
  },
] as MockMethod[]; 