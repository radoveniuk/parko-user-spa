import react from '@vitejs/plugin-react';
import dns from 'dns';
import { defineConfig } from 'vite';
import vitepluginSVGR from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths'; ;

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  define: {
    // here is the main update
    global: 'globalThis',
  },
  // depending on your application, base can also be "/"
  base: '',
  plugins: [react(), viteTsconfigPaths(), vitepluginSVGR()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 8081,
  },
});
