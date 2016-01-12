'use strict';

var extend = require('extend');

var defaults = {
  assets: {
    debug: false,
    optimize: false
  },
  debug: false,
  servers: {
    app: {
      host: '127.0.0.1',
      port: 3000,
      protocol: 'http'
    },
    assets: {
      host: '127.0.0.1',
      port: 3000,
      protocol: 'http'
    }
  }
};

/**
 * Produce a valid settings object
 *
 * @param {object} extensions Data that will be applied to the defaults
 * @returns {ChitonSettings}
 */
function settings(extensions) {
  return extend(true, {}, defaults, extensions || {});
}

module.exports = settings;
