import { defineConfig } from "cypress";
import cypressOtp from "cypress-otp";
import codeCoverageTask from "@cypress/code-coverage/task";
import path from "path";

const coverageWebpackConfig = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [
          "components",
          "models",
          "pages",
          "redux",
          "services",
          "utilities"
        ].map(directory => path.resolve(__dirname, directory)),
        enforce: "post",
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: false,
            configFile: false,
            plugins: [require.resolve("babel-plugin-istanbul")],
            sourceMaps: true
          }
        }
      }
    ]
  }
};

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
      bundler: "webpack",
      webpackConfig: coverageWebpackConfig
    },
    specPattern: "cypress/component/**/*.cy.{ts,tsx}",
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    supportFile: "cypress/support/component.ts"
  },
  e2e: {
    baseUrl: "https://stage.trainee.tis.nhs.uk/",
    // baseUrl: "http://local.tis-selfservice.com",
    specPattern: "cypress/e2e/**/*.spec.{ts,tsx}",
    chromeWebSecurity: false,
    defaultCommandTimeout: 60000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", { generateOTP: cypressOtp });
      require("cypress-mochawesome-reporter/plugin")(on);
      require("cypress-localstorage-commands/plugin")(on, config);
      return config;
    }
  },
  env: {
    username: "",
    password: "",
    secret: ""
  },
  blockHosts: ["*.google-analytics.com", "*.hotjar.com"]
});
