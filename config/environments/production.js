'use strict';

var settings = require('../settings');

/**
 * Load the settings for the production environment
 *
 * @returns {ChitonSettings}
 */
function load() {
  return settings.customize({
    servers: {
      api: {
        host: 'localhost',
        port: 8080,
        protocol: 'http'
      },
      assets: {
        host: 'localhost',
        port: 8081,
        protocol: 'http'
      }
    },
    webpack: {
      debug: false,
      optimize: true
    }
  });
}

module.exports = {
  load: load
};
