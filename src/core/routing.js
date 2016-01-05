'use strict';

var _ = require('lodash');

var errors = require('chiton/core/errors');

var GUID_SEPARATOR = '.';
var URL_SEPARATOR = '/';

var INDEX_ROUTE = 'index';

var LEADING_SLASH_MATCH = new RegExp('^' + URL_SEPARATOR);

var UrlError = errors.subclass();

/**
 * A Chiton route definition
 *
 * @typedef {object} ChitonRoute
 * @property {string} name The internal ID for the route
 * @property {string} url The path to the route
 * @property {ChitonRoute[]} urls Child URLs within the route's namespace
 */

/**
 * Flatten the routes into a non-nested list of route GUIDs
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} [namespace] The namespace prefix to use for all routes
 * @returns {string[]} A list of all route GUIDs
 */
function flatten(routes, namespace) {
  var prefix = namespace || '';
  if (prefix) { prefix += GUID_SEPARATOR; }

  return routes.reduce(function(flattened, route) {
    var guid = prefix + route.name;
    var guids = [];

    if (route.urls) {
      guids.push(guid + GUID_SEPARATOR + INDEX_ROUTE);
      guids = guids.concat(flatten(route.urls, guid));
    } else {
      guids.push(guid);
    }

    return flattened.concat(guids);
  }, []);
}

/**
 * Determine the name of the route described by a URL
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} path The path component of a URL
 * @returns {?string} The name of the route
 */
function resolve(routes, path) {
  var matches = routes.filter(function(route) {
    var match = new RegExp('^' + route.url + '/?', 'i');
    return match.test(path);
  });

  if (matches.length > 1) {
    var uniqueUrls = _.uniq(_.pluck(matches, 'url'));
    if (uniqueUrls.length !== matches.length) {
      throw new UrlError('Multiple routes match the path "' + path + '"');
    }
  } else if (!matches.length) {
    return null;
  }

  var match;
  if (matches.length) {
    match = _.first(_.sortBy(matches, function(route) { return route.url.length * -1; }));
  } else {
    match = matches[0];
  }

  var routeName = match.name;
  if (routeName === undefined) {
    throw new UrlError('No name was given to the route with a URL of "' + match.url + '"');
  }

  var remainder = path.substring(match.url.length).replace(LEADING_SLASH_MATCH, '');
  if (remainder) {
    var subroutes = match.urls || [];
    var subname = resolve(subroutes, remainder);
    if (subname) {
      routeName += GUID_SEPARATOR + subname;
    } else {
      routeName = null;
    }
  } else if (match.urls) {
    routeName += GUID_SEPARATOR + INDEX_ROUTE;
  }

  return routeName;
}

/**
 * Produce the URL for accessing a named route
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} guid The unique identifier for the route
 * @returns {string} The URL for the route
 * @throws {UrlError} If no URL for the route was found
 */
function url(routes, guid) {
  var hierarchy = guid.split(GUID_SEPARATOR);
  var parentName = hierarchy[0];
  var endpoint = _.last(hierarchy) === INDEX_ROUTE ? -1 : hierarchy.length;
  var childNames = hierarchy.slice(1, endpoint);

  var matches = routes.filter(function(route) { return route.name === parentName; });

  if (!matches.length) { throw new UrlError('No route named "' + guid + '" was found'); }
  if (matches.length > 1) { throw new UrlError('Multiple routes named "' + guid + '" were found'); }

  var parentRoute = matches[0];
  var path = parentRoute.url;

  if (path === undefined) {
    throw new UrlError('No URL was found for the route named "' + guid + '"');
  }

  if (childNames.length) {
    var subroutes = parentRoute.urls || [];
    var separator = parentRoute.url === URL_SEPARATOR ? '' : URL_SEPARATOR;
    path += separator + url(subroutes, childNames.join(GUID_SEPARATOR));
  }

  return path;
}

module.exports = {
  flatten: flatten,
  resolve: resolve,
  url: url,
  UrlError: UrlError
};
