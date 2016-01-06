'use strict';

var _ = require('lodash');
var extend = require('extend');

var ConfigurationError = require('chiton/core/errors/configuration-error');

var GUID_SEPARATOR = '.';
var PATH_SEPARATOR = '/';

var INDEX_ROUTE = 'index';

var LEADING_SLASH_MATCH = new RegExp('^' + PATH_SEPARATOR);

/**
 * A Chiton route definition
 *
 * @typedef {object} ChitonRoute
 * @property {string} name The internal ID for the route
 * @property {string} path The path to the route
 * @property {ChitonRoute[]} paths Child paths within the route's namespace
 */

/**
 * Transform a route definition into a map between GUIDs and name components
 *
 * Each GUID is a string that is guaranteed to not conflict with any other URL.
 * The name components are represented as an array of strings representing each
 * level in the hierarchy of the route.
 *
 * @param {ChitonRoute[]} routes A route definition
 * @returns {object} A list of all route GUIDs
 */
function routesToGuids(routes) {
  function createGuids(subroutes, namespace) {
    return subroutes.reduce(function(guids, route) {
      var levels = namespace.concat([route.name]);

      if (route.paths) {
        extend(guids, createGuids(route.paths, levels));
        levels.push(INDEX_ROUTE);
      }

      var guid = levels.join(GUID_SEPARATOR);
      guids[guid] = levels;

      return guids;
    }, {});
  }

  return createGuids(routes, []);
}

/**
 * Determine the name of the route described by a path
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} path The path component of a URL
 * @returns {?string} The name of the route
 * @throws {ConfigurationError} If multiple routes match the given path
 * @throws {ConfigurationError} If the matching route lacks a name
 */
function pathToRoute(routes, path) {
  var matches = routes.filter(function(route) {
    var match = new RegExp('^' + route.path + PATH_SEPARATOR + '?', 'i');
    return match.test(path);
  });

  if (matches.length > 1) {
    var uniquePaths = _.uniq(_.pluck(matches, 'path'));
    if (uniquePaths.length !== matches.length) {
      throw new ConfigurationError('Multiple routes match the path "' + path + '"');
    }
  } else if (!matches.length) {
    return null;
  }

  var match;
  if (matches.length) {
    match = _.first(_.sortBy(matches, route => route.path.length * -1));
  } else {
    match = matches[0];
  }

  var routeName = match.name;
  if (routeName === undefined) {
    throw new ConfigurationError('No name was given to the route with a path of "' + match.path + '"');
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
 * @throws {ConfigurationError} If no path for the route was found
 */
function routeToPath(routes, guid) {
  var hierarchy = guid.split(GUID_SEPARATOR);
  var parentName = hierarchy[0];
  var endpoint = _.last(hierarchy) === INDEX_ROUTE ? -1 : hierarchy.length;
  var childNames = hierarchy.slice(1, endpoint);

  var matches = routes.filter(route => route.name === parentName);

  if (!matches.length) { throw new ConfigurationError('No route named "' + guid + '" was found'); }
  if (matches.length > 1) { throw new ConfigurationError('Multiple routes named "' + guid + '" were found'); }

  var parentRoute = matches[0];
  var path = parentRoute.path;

  if (path === undefined) {
    throw new ConfigurationError('No path was found for the route named "' + guid + '"');
  }

  if (childNames.length) {
    var subroutes = parentRoute.paths || [];
    var separator = parentRoute.path === PATH_SEPARATOR ? '' : PATH_SEPARATOR;
    path += separator + routeToPath(subroutes, childNames.join(GUID_SEPARATOR));
  }

  return path;
}

module.exports = {
  routesToGuids: routesToGuids,
  pathToRoute: pathToRoute,
  routeToPath: routeToPath
};
