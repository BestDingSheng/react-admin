import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/users',
    method: 'get',
    response: () => {
      return {
        code: 0,
        result: {
          'list|10': [{
            id: '@id',
            name: '@cname',
            'age|20-50': 20,
            email: '@email',
            'status|1': ['active', 'inactive'],
            createTime: '@datetime',
          }],
          total: 100,
        },
        message: 'success',
      };
    },
  },
  {
    url: '/api/user/:id',
    method: 'get',
    response: ({ query }: { query: Record<string, any> }) => {
      return {
        code: 0,
        result: {
          id: query.id,
          name: '@cname',
          'age|20-50': 20,
          email: '@email',
          'status|1': ['active', 'inactive'],
          createTime: '@datetime',
        },
        message: 'success',
      };
    },
  },
] as MockMethod[]; 