'use strict';

// Possible media-type bundles
var MEDIA_TYPES = ['css', 'js'];

/**
 * Create a map of asset-bundle descriptions for a webpack config
 *
 * @param {Object} config A webpack configuration
 * @returns {Object} A mapping of bundle IDs to asset URLs
 */
function urls(config) {
  return Object.keys(config.entry).reduce(function(entries, entry) {
    entries[entry] = MEDIA_TYPES.reduce(function(urls, media) {
      urls[media] = config.output.publicPath + entry + '.' + media;
      return urls;
    }, {});
    return entries;
  }, {});
}

module.exports = {
  urls: urls
};
