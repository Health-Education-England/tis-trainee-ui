import { defineConfig } from "cypress";
import cypressOtp from "cypress-otp";
import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    assetsDir: "cypress/reports/assets",
    reportPageTitle: "index.html",
    embeddedScreenshots: true,
    inlineAssets: true
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    },
    specPattern: "cypress/component/**/*.cy.{ts,tsx}",
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    supportFile: "cypress/support/component.ts"
  },
  e2e: {
    baseUrl: "https://trainee.tis.nhs.uk/",
    // baseUrl: "http://local.tis-selfservice.com",
    specPattern: "cypress/e2e/**/*.spec.{ts,tsx}",
    chromeWebSecurity: false,
    defaultCommandTimeout: 15000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", { generateOTP: cypressOtp });
      codeCoverageTask(on, config);
      require("cypress-mochawesome-reporter/plugin")(on);
      require("cypress-localstorage-commands/plugin")(on, config);
      return config;
    }
  }
});
