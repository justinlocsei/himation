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
      api: {
        host: 'localhost',
        port: 8080
      },
      assets: {
        host: 'localhost',
        port: 8081
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
