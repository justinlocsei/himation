'use strict';

/**
 * Get the URL for accessing a webpack resource bundle
 *
 * @param {Object} config A webpack configuration
 * @param {string} entry The name of a webpack entry point
 * @param {string} extension The file extension for the bundle
 * @returns {string} The URL for viewing the resource
 */
function bundle(config, entry, extension) {
  return config.output.publicPath + entry + '.' + extension;
}

module.exports = {
  bundle: bundle
};
