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
  envPrefix: "REACT_APP_",
  server: {
    origin: "http://local.tis.com",
    port: 3000
  },
  plugins: [react(), envCompatible(), tsconfigPaths()]
});
