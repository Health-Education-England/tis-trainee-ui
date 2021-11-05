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

// Found this tidier solution https://github.com/elevatebart/cy-ct-cra/blob/master/cypress/plugins/index.js for CRA cypress and ct coverage config

require("@cypress/instrument-cra");
const injectCraDevServer = require("@cypress/react/plugins/react-scripts");
const codeCoverageTask = require("@cypress/code-coverage/task");

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  injectCraDevServer(on, config);
  codeCoverageTask(on, config);

  return config;
};
