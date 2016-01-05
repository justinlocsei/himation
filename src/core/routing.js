'use strict';

var _ = require('lodash');

var errors = require('chiton/core/errors');

var GUID_SEPARATOR = '.';
var PATH_SEPARATOR = '/';

var INDEX_ROUTE = 'index';

var LEADING_SLASH_MATCH = new RegExp('^' + PATH_SEPARATOR);

var RoutingError = errors.subclass();

/**
 * A Chiton route definition
 *
 * @typedef {object} ChitonRoute
 * @property {string} name The internal ID for the route
 * @property {string} path The path to the route
 * @property {ChitonRoute[]} paths Child paths within the route's namespace
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

    if (route.paths) {
      guids.push(guid + GUID_SEPARATOR + INDEX_ROUTE);
      guids = guids.concat(flatten(route.paths, guid));
    } else {
      guids.push(guid);
    }

    return flattened.concat(guids);
  }, []);
}

/**
 * Determine the name of the route described by a path
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} path The path component of a URL
 * @returns {?string} The name of the route
 */
function pathToRoute(routes, path) {
  var matches = routes.filter(function(route) {
    var match = new RegExp('^' + route.path + PATH_SEPARATOR + '?', 'i');
    return match.test(path);
  });

  if (matches.length > 1) {
    var uniquePaths = _.uniq(_.pluck(matches, 'path'));
    if (uniquePaths.length !== matches.length) {
      throw new RoutingError('Multiple routes match the path "' + path + '"');
    }
  } else if (!matches.length) {
    return null;
  }

  var match;
  if (matches.length) {
    match = _.first(_.sortBy(matches, function(route) { return route.path.length * -1; }));
  } else {
    match = matches[0];
  }

  var routeName = match.name;
  if (routeName === undefined) {
    throw new RoutingError('No name was given to the route with a path of "' + match.path + '"');
  }

  var remainder = path.substring(match.path.length).replace(LEADING_SLASH_MATCH, '');
  if (remainder) {
    var subroutes = match.paths || [];
    var subname = pathToRoute(subroutes, remainder);
    if (subname) {
      routeName += GUID_SEPARATOR + subname;
    } else {
      routeName = null;
    }
  } else if (match.paths) {
    routeName += GUID_SEPARATOR + INDEX_ROUTE;
  }

  return routeName;
}

/**
 * Produce the path for accessing a named route
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} guid The unique identifier for the route
 * @returns {string} The path for the route
 * @throws {RoutingError} If no path for the route was found
 */
function routeToPath(routes, guid) {
  var hierarchy = guid.split(GUID_SEPARATOR);
  var parentName = hierarchy[0];
  var endpoint = _.last(hierarchy) === INDEX_ROUTE ? -1 : hierarchy.length;
  var childNames = hierarchy.slice(1, endpoint);

  var matches = routes.filter(function(route) { return route.name === parentName; });

  if (!matches.length) { throw new RoutingError('No route named "' + guid + '" was found'); }
  if (matches.length > 1) { throw new RoutingError('Multiple routes named "' + guid + '" were found'); }

  var parentRoute = matches[0];
  var path = parentRoute.path;

  if (path === undefined) {
    throw new RoutingError('No path was found for the route named "' + guid + '"');
  }

  if (childNames.length) {
    var subroutes = parentRoute.paths || [];
    var separator = parentRoute.path === PATH_SEPARATOR ? '' : PATH_SEPARATOR;
    path += separator + routeToPath(subroutes, childNames.join(GUID_SEPARATOR));
  }

  return path;
}

module.exports = {
  flatten: flatten,
  pathToRoute: pathToRoute,
  routeToPath: routeToPath,
  RoutingError: RoutingError
};
