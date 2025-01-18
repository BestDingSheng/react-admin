const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const createProxyConfig = require('./proxy.config.cjs');
require('dotenv').config({ path: '.env.production' });

const app = express();
const PORT = process.env.PORT || 5173;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 配置所有代理路径
const proxyConfigs = createProxyConfig(process.env);
Object.entries(proxyConfigs).forEach(([path, config]) => {
  app.use(path, createProxyMiddleware(config));
});

// 所有其他请求返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
}); 