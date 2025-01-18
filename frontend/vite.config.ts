/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import createProxyConfig from './proxy.config.cjs'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isMock = env.VITE_USE_MOCK === 'true';
  
  return {
    plugins: [
      react(),
      viteMockServe({
        mockPath: 'src/mock',
        enable: isMock,
        logger: true,
        watchFiles: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: createProxyConfig(env)
    },
  };
});
