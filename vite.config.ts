/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["jss-plugin-globalThis"]
    }
  },
  define: {
    // https://github.com/vitejs/vite/discussions/5912
    // https://github.com/vitejs/vite/issues/8909
    global: "globalThis"
  },
  envPrefix: "REACT_APP_",
  resolve: {
    alias: [
      {
        find: "common",
        replacement: resolve(__dirname, "src/common")
      },
      // build issue with amplify fix:
      // 'request' is not exported by __vite-browser-external, imported by node_modules/@aws-sdk/credential-provider-imds/dist/es/remoteProvider/httpRequest.js
      // https://stackoverflow.com/questions/70938763/build-problem-with-react-vitejs-and-was-amplify
      { find: "./runtimeConfig", replacement: "./runtimeConfig.browser" }
    ]
  },
  server: {
    origin: "http://local.tis.com",
    port: 3000
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporter: ["text", "lcov", "html"]
      // exclude: [
      //   "node_modules/",
      //   "src/setupTests.ts",
      //   "!**/src/mock-data/*.{js,jsx,ts,tsx}",
      //   "!**/src/redux/store/*.{js,jsx,ts,tsx}",
      //   "!**/src/redux/types.ts",
      //   "!**/src/components/forms/formr-part-b/Sections/SectionProps.ts",
      //   "!**/src/*.{js,ts}",
      //   "!**/src/index.tsx",
      //   "!**/src/models/*.ts",
      //   "!**/src/redux/reducers/index.ts",
      //   "!**/src/**cy-test.tsx"
      // ]
    },
    restoreMocks: false
  },
  plugins: [react(), envCompatible(), tsconfigPaths()]
});
