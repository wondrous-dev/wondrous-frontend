import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import vitePluginRequire from 'vite-plugin-require';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import dynamicImport from 'vite-plugin-dynamic-import';

// https://vitejs.dev/config/

const requirePlugin = () => (vitePluginRequire as any).default({});
export default defineConfig({
  plugins: [react(), tsconfigPaths(), requirePlugin(), dynamicImport()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  define: {
    'window.global': {},
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
