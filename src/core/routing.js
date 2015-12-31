'use strict';

var _ = require('lodash');

var errors = require('chiton/core/errors');

var ROUTE_SEPARATOR = '.';
var URL_SEPARATOR = '/';

var LEADING_SLASH_MATCH = new RegExp('^' + URL_SEPARATOR);

var UrlError = errors.subclass();

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
      routeName += ROUTE_SEPARATOR + subname;
    } else {
      routeName = null;
    }
  }

  return routeName;
}

/**
 * Produce the URL for accessing a named route
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} routeName The name of the route
 * @returns {string} The URL for the route
 * @throws {UrlError} If no URL for the route was found
 */
function url(routes, routeName) {
  var hierarchy = routeName.split(ROUTE_SEPARATOR);
  var parentName = hierarchy[0];
  var childNames = hierarchy.slice(1);

  var matches = routes.filter(function(route) { return route.name === parentName; });

  if (!matches.length) { throw new UrlError('No route named "' + routeName + '" was found'); }
  if (matches.length > 1) { throw new UrlError('Multiple routes named "' + routeName + '" were found'); }

  var parentRoute = matches[0];
  var path = parentRoute.url;

  if (path === undefined) {
    throw new UrlError('No URL was found for the route named "' + routeName + '"');
  }

  if (childNames.length) {
    var subroutes = parentRoute.urls || [];
    var separator = parentRoute.url === URL_SEPARATOR ? '' : URL_SEPARATOR;
    path += separator + url(subroutes, childNames.join(ROUTE_SEPARATOR));
  }

  return path;
}

module.exports = {
  resolve: resolve,
  url: url,
  UrlError: UrlError
};
