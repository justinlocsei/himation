'use strict';

var settings = require('../settings');

/**
 * Load the settings for the development environment
 *
 * @returns {ChitonSettings}
 */
function load() {
  return settings.customize({
    servers: {
      app: {
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
      debug: true,
      optimize: false
    }
  });
}

module.exports = {
  load: load
};
