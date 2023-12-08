import react from '@vitejs/plugin-react';
import dns from 'dns';
import { defineConfig } from 'vite';
import vitepluginSVGR from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
  define: {
    global: 'globalThis',
  },
  base: '',
  plugins: [react(), viteTsconfigPaths(), vitepluginSVGR()],
  server: {
    open: true,
    port: 8081,
    proxy: {
      '/api': {
        target: 'https://parko-user.com:3000',
        // target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
