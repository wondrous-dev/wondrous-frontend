import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  define: {
    "window.global": {},
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
    VITE_GRAPHQL_SERVER_URL: process.env.VITE_GRAPHQL_SERVER_URL,
    VITE_DISCORD_CLIENT_ID: process.env.VITE_DISCORD_CLIENT_ID,
    VITE_PRODUCTION: process.env.VITE_PRODUCTION,
    VITE_STAGING: process.env.VITE_STAGING,
    VITE_WALLET_CONNECT_PROJECT_ID: process.env.VITE_WALLET_CONNECT_PROJECT_ID,
    VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID,
  },
});
