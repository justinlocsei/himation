'use strict';

var extend = require('extend');

var defaults = {
  assets: {
    debug: false,
    distDir: '/tmp',
    optimize: false
  },
  chiton: {
    endpoint: 'http://127.0.0.1',
    token: 'token'
  },
  environment: 'development',
  errors: {
    track: false,
    sentryDsn: 'DSN',
    sentryPublicDsn: 'DSN'
  },
  server: {
    debugLogging: false
  },
  servers: {
    app: {
      address: '127.0.0.1',
      path: '/',
      port: 3000,
      protocol: 'http',
      publicUrl: 'http://127.0.0.1:3000'
    },
    assets: {
      address: '127.0.0.1',
      path: '/',
      port: 3000,
      protocol: 'http',
      publicUrl: 'http://127.0.0.1:3000'
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
