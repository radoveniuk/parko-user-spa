import react from '@vitejs/plugin-react';
import dns from 'dns';
import { defineConfig } from 'vite';
import vitepluginSVGR from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
  define: {
    // here is the main update
    global: 'globalThis',
  },
  base: '',
  plugins: [react(), viteTsconfigPaths(), vitepluginSVGR()],
  server: {
    open: true,
    port: 8081,
  },
});
