'use strict';

/**
 * Extract assets URLs from webpack build stats
 *
 * @param {object} build JSON stats on a weback build
 * @param {string} entry The name of a webpack entry point
 * @param {string} extension The file extension for the requested media type
 * @returns {string[]} The paths to the entry point's assets
 */
function extract(build, entry, extension) {
  var path = build.publicPath.replace(/\/$/, '') + '/';
  var matcher = new RegExp('\.' + extension + '$');

  var files = build.assetsByChunkName[entry] || [];
  var matches = files.filter(function(file) { return matcher.test(file); });
  return matches.map(function(match) { return path + match; });
}

module.exports = {
  extract: extract
};
