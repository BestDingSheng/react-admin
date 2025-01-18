interface Env {
  VITE_USE_MOCK?: string;
  VITE_KEEP_API_PREFIX?: string;
  VITE_API_URL?: string;
  VITE_WS_URL?: string;
  [key: string]: string | undefined;
}

interface ProxyConfig {
  target: string;
  changeOrigin: boolean;
  rewrite?: (path: string) => string;
  pathRewrite?: { [key: string]: string };
  secure?: boolean;
  ws?: boolean;
  [key: string]: any;
}

interface PathConfig {
  target?: string;
  prefix: string;
  changeOrigin?: boolean;
  rewrite?: boolean;
  rewriteRule?: (path: string) => string;
  pathRewrite?: { [key: string]: string };
  options?: {
    secure?: boolean;
    ws?: boolean;
    [key: string]: any;
  };
}

declare const createProxyConfig: (env: Env) => {
  [key: string]: ProxyConfig;
};

export = createProxyConfig; 