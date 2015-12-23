'use strict';

var _ = require('lodash');

/**
 * Determine the name of the route described by a URL
 *
 * @param {ChitonRoutes} routes A map of route names to URLs
 * @param {string} path The path component of a URL
 * @returns {?string} The name of the route
 */
function reverse(routes, path) {
  var matches = _.dropWhile(Object.keys(routes), function(name) {
    return routes[name] !== path;
  });
  return matches[0] || null;
}

/**
 * Produce the URL for accessing a named route
 *
 * @param {ChitonRoutes} routes A map of route names to URLs
 * @param {string} name The name of the route
 * @returns {string} The URL for the route
 */
function url(routes, name) {
  return routes[name];
}

module.exports = {
  reverse: reverse,
  url: url
};
