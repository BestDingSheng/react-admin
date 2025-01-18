/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isMock = env.VITE_USE_MOCK === 'true';
  const keepApiPrefix = env.VITE_KEEP_API_PREFIX === 'true';
  
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
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          // rewrite: (!isMock && !keepApiPrefix) ? (path: string) => path.replace(/^\/api/, '') : undefined,
        },
      },
    },
  };
});
