'use strict';

var environments = require('./environments');

var serverConfig = {
  api: {
    host: 'localhost',
    port: 8080
  },
  assets: {
    host: 'localhost',
    port: 8081
  }
};

/**
 * Expose server configurations for a given environment
 *
 * @param {string} environment The name of an environment
 * @returns {Object} Server definitions for the environment
 */
function servers(environment) {
  return environments.tailor(environment, {
    development: serverConfig,
    production: serverConfig
  });
}

module.exports = {
  servers: servers
};
