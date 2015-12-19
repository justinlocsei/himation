'use strict';

var extend = require('extend');

/**
 * @typedef {Object} ChitonSettings
 * @property {Object} servers Addresses for all known servers
 * @property {Object} servers.api Address components for the API server
 * @property {string} servers.api.host The hostname for the API server
 * @property {number} servers.api.port The port for the API server
 * @property {Object} servers.assets Address components for the assets server
 * @property {string} servers.assets.host The hostname for the assets server
 * @property {number} servers.assets.port The port for the assets server
 * @property {Object} webpack Webpack configuration information
 * @property {boolean} webpack.debug Whether to run webpack in debug mode
 * @property {boolean} webpack.optimize Whether to optimize all bundled assets
 */
var defaults = {
  servers: {
    api: {},
    assets: {}
  },
  webpack: {
    debug: false,
    optimize: false
  }
};

/**
 * Create custom settings by merging the given settings with the defaults
 *
 * @param {Object} options Custom options to apply to the default settings
 * @returns {ChitonSettings} The custom settings
 */
function customize(options) {
  return extend(true, {}, defaults, options || {});
}

module.exports = {
  customize: customize
};
