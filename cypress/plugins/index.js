/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/*jkl=,p,*
 * @type {Cypress.PluginConfig}
 */
import findReactScriptsWebpackConfig from "@cypress/react/plugins/react-scripts/findReactScriptsWebpackConfig";

import { startDevServer } from "@cypress/webpack-dev-server";

import codeCoverageTask from "@cypress/code-coverage/task";

import cypressOtp from "cypress-otp";

module.exports = (on, config) => {
  on("task", { generateOTP: cypressOtp });
  codeCoverageTask(on, config);
  if (config.testingType === "component") {
    const webpackConfig = findReactScriptsWebpackConfig(config, {
      webpackConfigPath: "react-scripts/config/webpack.config"
    });
    const rules = webpackConfig.module.rules.find(rule => !!rule.oneOf).oneOf;
    const babelRule = rules.find(rule => /babel-loader/.test(rule.loader));
    babelRule.options.plugins.push(require.resolve("babel-plugin-istanbul"));
    on("dev-server:start", options => {
      return startDevServer({ options, webpackConfig });
    });
  }
  return config;
};
