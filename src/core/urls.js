'use strict';

var URL = require('url');

// Default ports for protocols
var PORTS = {
  http: 80,
  https: 443
};

/**
 * Make a URL be absolute, relative to an existing absolute URL
 *
 * @param {string} url The URL to make absolute
 * @param {string} root The absolute base for the URL
 * @returns {string} An absolute URL
 */
function absolute(url, root) {
  var parts = URL.parse(url, false, true);

  if (parts.host) {
    return url;
  } else {
    return URL.resolve(root, url);
  }
}

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

module.exports = {
  absolute: absolute,
  expandHostname: expandHostname
};
