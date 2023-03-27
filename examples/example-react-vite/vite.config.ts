import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
//https://github.com/vitejs/vite/discussions/3126 ==> node polyfills (needs update for vite 4)
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), nodePolyfills({ protocolImports: false })],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
