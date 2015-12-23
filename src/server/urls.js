'use strict';

var url = require('url');

// Default ports for protocols
var PORTS = {
  http: 80,
  https: 443
};

/**
 * Make a URL be absolute, relative to an existing absolute URL
 *
 * @param {string} base The URL to make absolute
 * @param {string} root The absolute base for the URL
 * @returns {string} An absolute URL
 */
function absolute(base, root) {
  var parts = url.parse(base);

  if (parts.protocol && parts.path) {
    return base;
  } else {
    return url.resolve(root, base);
  }
}

/**
 * Expand a hostname to include a protocol and port
 *
 * @param {string} host A hostname
 * @param {object} options Information on how to expand the hostname
 * @param {number} options.port The port to use
 * @param {string} options.protocol The protocol to use
 * @returns {string} The hostname with a protocol and port
 */
function expandHost(host, options) {
  var settings = options || {};

  var protocol = settings.protocol || 'http';
  var port = settings.port !== PORTS[protocol] ? settings.port : null;

  return url.format({
    hostname: host,
    protocol: protocol,
    port: port
  });
}

module.exports = {
  absolute: absolute,
  expandHost: expandHost
};
