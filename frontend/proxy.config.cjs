const createProxyConfig = (env) => {
  const isMock = env.VITE_USE_MOCK === 'true';
  const keepApiPrefix = env.VITE_KEEP_API_PREFIX === 'true';
  const target = env.VITE_API_URL || 'http://localhost:3000';

  // 定义代理路径配置
  const proxyPaths = {
    '/api': {
      target,  // 可以为每个路径配置不同的目标服务器
      prefix: '/api',
      changeOrigin: true,
      // 是否需要重写路径
      rewrite: !keepApiPrefix,
      // 自定义重写规则（可选）
      rewriteRule: (path) => path.replace(/^\/api/, ''),
      // 其他 http-proxy-middleware 的配置项（可选）
      options: {
        secure: false,  // 例如：是否验证SSL证书
        ws: true,      // 例如：是否代理 websockets
        // ...其他配置
      }
    },
    '/auth': {
      target,
      prefix: '/auth',
      changeOrigin: true,
      rewrite: false,  // 不重写路径
      options: {
        secure: false
      }
    },
    '/ws': {
      target: env.VITE_WS_URL || 'ws://localhost:3000',
      prefix: '/ws',
      changeOrigin: true,
      rewrite: false,
      options: {
        ws: true  // 支持 websocket
      }
    }
    // 可以在这里添加更多的路径配置
  };

  // 生成代理配置
  const generateProxyConfig = (pathConfig) => {
    const baseConfig = {
      target: pathConfig.target || target,
      changeOrigin: pathConfig.changeOrigin !== false,
      ...(pathConfig.options || {})
    };

    // 如果需要重写且不是 mock 模式
    if (!isMock && pathConfig.rewrite) {
      return {
        ...baseConfig,
        rewrite: pathConfig.rewriteRule || ((path) => path.replace(new RegExp(`^${pathConfig.prefix}`), '')),
        pathRewrite: pathConfig.pathRewrite || { [`^${pathConfig.prefix}`]: '' }
      };
    }

    return baseConfig;
  };

  // 返回所有路径的代理配置
  return Object.entries(proxyPaths).reduce((configs, [path, config]) => ({
    ...configs,
    [path]: generateProxyConfig(config)
  }), {});
};

module.exports = createProxyConfig; 