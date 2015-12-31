'use strict';

/**
 * Chiton route definitions
 *
 * @typedef {object} ChitonRoute
 * @property {string} name The internal ID for the route
 * @property {string} url The path to the route
 * @property {ChitonRoute[]} urls Child URLs within the route's namespace
 */
var routes = [{
  name: 'chiton',
  url: '/',
  urls: [
    {url: 'about', name: 'about'}
  ]
}];

module.exports = routes;
