'use strict';

var extend = require('extend');

/**
 * Chiton server settings
 *
 * @typedef {object} ChitonServerSettings
 * @property {string} host The hostname for the server
 * @property {number} port The port for the server
 * @property {string} protocol The protocol for the server
 */

/**
 * Chiton environment settings
 *
 * @typedef {object} ChitonSettings
 * @property {object} assets Asset configuration information
 * @property {boolean} assets.debug Whether to bundle assets in debug mode
 * @property {boolean} assets.optimize Whether to optimize all bundled assets
 * @property {boolean} debug Whether to run in debugging mode
 * @property {object} servers Addresses for all known servers
 * @property {ChitonServerSettings} servers.app Address components for the application server
 * @property {ChitonServerSettings} servers.assets Address components for the assets server
 */
var defaults = {
  assets: {
    debug: false,
    optimize: false
  },
  debug: false,
  servers: {
    app: {
      port: 80,
      protocol: 'http'
    },
    assets: {
      port: 80,
      protocol: 'http'
    }
  }
};

/**
 * Create custom settings by merging the given settings with the defaults
 *
 * @param {object} options Custom options to apply to the default settings
 * @returns {ChitonSettings} The custom settings
 */
function customize(options) {
  return extend(true, {}, defaults, options || {});
}

module.exports = {
  customize: customize
};
