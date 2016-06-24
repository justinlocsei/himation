'use strict';

var extend = require('extend');

var defaults = {
  assets: {
    debug: false,
    optimize: false
  },
  server: {
    debugLogging: false
  },
  servers: {
    app: {
      address: '127.0.0.1',
      path: '/',
      port: 3000,
      protocol: 'http'
    },
    assets: {
      address: '127.0.0.1',
      path: '/',
      port: 3000,
      protocol: 'http'
    }
  }
};

/**
 * Produce a valid settings object
 *
 * @param {object} extensions Data that will be applied to the defaults
 * @returns {HimationSettings}
 */
function settingsFactory(extensions) {
  return extend(true, {}, defaults, extensions || {});
}

module.exports = settingsFactory;
