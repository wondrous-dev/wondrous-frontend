import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  define: {
    'window.global': {},
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
    VITE_GRAPHQL_SERVER_URL: process.env.VITE_GRAPHQL_SERVER_URL,
    VITE_DISCORD_CLIENT_ID: process.env.VITE_DISCORD_CLIENT_ID,
    VITE_PRODUCTION: process.env.VITE_PRODUCTION,
    VITE_STAGING: process.env.VITE_STAGING,
  },
  resolve: {
    alias: {
      util: 'rollup-plugin-node-polyfills/polyfills/util',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },

      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),

        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
