'use strict';

var extend = require('extend');

/**
 * @typedef {object} ChitonSettings
 * @property {object} servers Addresses for all known servers
 * @property {object} servers.app Address components for the application server
 * @property {string} servers.app.host The hostname for the application server
 * @property {number} servers.app.port The port for the application server
 * @property {object} servers.assets Address components for the assets server
 * @property {string} servers.assets.host The hostname for the assets server
 * @property {number} servers.assets.port The port for the assets server
 * @property {object} webpack Webpack configuration information
 * @property {boolean} webpack.debug Whether to run webpack in debug mode
 * @property {boolean} webpack.optimize Whether to optimize all bundled assets
 */
var defaults = {
  servers: {
    app: {},
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
 * @param {object} options Custom options to apply to the default settings
 * @returns {ChitonSettings} The custom settings
 */
function customize(options) {
  return extend(true, {}, defaults, options || {});
}

module.exports = {
  customize: customize
};
