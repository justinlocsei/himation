'use strict';

var URL = require('url');

var DOUBLE_SEPARATORS_MATCH = new RegExp(/\/{2,}/g);
var TRAILING_SEPARATOR_MATCH = new RegExp(/\/$/);

// Default ports for protocols
var PORTS = {
  http: 80,
  https: 443
};

/**
 * Expand a hostname to include a protocol and port
 *
 * @param {string} hostname A hostname
 * @param {object} options Information on how to expand the hostname
 * @param {number} options.port The port to use
 * @param {string} options.protocol The protocol to use
 * @returns {string} The hostname with a protocol and port
 */
function expandHostname(hostname, options) {
  var settings = options || {};

  var protocol = settings.protocol || 'http';
  var port = settings.port !== PORTS[protocol] ? settings.port : null;

  var url = URL.format({
    hostname: hostname,
    protocol: protocol,
    port: port
  });

  return url.replace(/^\/{2}:/, '//');
}

/**
 * Join a series of path components
 *
 * @param {string[]} paths A series of path components to a URL
 * @returns {string} A single path string
 */
function joinPaths(paths) {
  var path = paths.join('/');
  return path.replace(DOUBLE_SEPARATORS_MATCH, '/').replace(TRAILING_SEPARATOR_MATCH, '') || '/';
}

/**
 * Convert a relative URL to an absolute URL rooted in an absolute root URL
 *
 * @param {string} url The URL to make absolute
 * @param {string} root The absolute base for the URL
 * @returns {string} An absolute URL
 */
function relativeToAbsolute(url, root) {
  var parts = URL.parse(url, false, true);

  if (parts.host) {
    return url;
  } else {
    return URL.resolve(root, url);
  }
}

module.exports = {
  expandHostname: expandHostname,
  joinPaths: joinPaths,
  relativeToAbsolute: relativeToAbsolute
};
