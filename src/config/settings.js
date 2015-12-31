'use strict';

var extend = require('extend');

/**
 * Chiton environment settings
 *
 * @typedef {object} ChitonSettings
 * @property {object} assets Asset configuration information
 * @property {boolean} assets.debug Whether to bundle assets in debug mode
 * @property {boolean} assets.optimize Whether to optimize all bundled assets
 * @property {object} servers Addresses for all known servers
 * @property {object} servers.app Address components for the application server
 * @property {string} servers.app.host The hostname for the application server
 * @property {number} servers.app.port The port for the application server
 * @property {object} servers.assets Address components for the assets server
 * @property {string} servers.assets.host The hostname for the assets server
 * @property {number} servers.assets.port The port for the assets server
 */
var defaults = {
  assets: {
    debug: false,
    optimize: false
  },
  servers: {
    app: {},
    assets: {}
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
