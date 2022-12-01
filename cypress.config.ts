import { defineConfig } from "cypress";
import "@cypress/instrument-cra";
import cypressOtp from "cypress-otp";
import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack"
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    supportFile: "cypress/support/component.ts"
  },
  e2e: {
    baseUrl: "http://local.tis-selfservice.com",
    specPattern: "cypress/e2e/**/*.spec.{ts,tsx}",
    chromeWebSecurity: false,
    defaultCommandTimeout: 15000,
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      configFile: "reporter-config.json"
    },
    setupNodeEvents(on, config) {
      on("task", { generateOTP: cypressOtp });
      codeCoverageTask(on, config);
      return config;
    },
    supportFile: "cypress/support/e2e.ts"
  }
});
