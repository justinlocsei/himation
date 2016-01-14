'use strict';

var _ = require('lodash');
var extend = require('extend');

var errors = require('himation/core/errors');
var urls = require('himation/core/urls');

var DEFAULT_METHOD = 'get';
var GUID_SEPARATOR = '.';
var INDEX_ROUTE = 'index';

/**
 * A Himation route definition
 *
 * @typedef {object} HimationRouteDefinition
 * @property {string} [method] The HTTP method to use for accessing the URL
 * @property {string} name The internal ID for the route
 * @property {string} path The path to the route
 * @property {HimationRouteDefinition[]} paths Child paths within the route's namespace
 */

/**
 * A Himation route
 *
 * @typedef {object} HimationRoute
 * @property {HimationRouteGUID} guid The route's GUID
 * @property {string} method The HTTP method to use for accessing the URL
 * @property {string} path The full path to the route
 */

/**
 * A GUID for a Himation route
 *
 * Route GUIDS are guaranteed to not conflict with any other routes, and define
 * their hierarchy as a string separated by dots.
 *
 * @typedef {string} HimationRouteGUID
 */

 /**
  * Transform route definitions into routes
  *
  * @param {HimationRouteDefinition[]} routes Route definitions
  * @returns {HimationRoute[]} A flat list of routes
  */
function defineRoutes(routes) {
  var conflicts = {};

  function resolveRoutes(subroutes, namespace) {
    return subroutes.reduce(function(resolved, route) {
      if (!route.name) { throw new errors.ConfigurationError('All routes require a name'); }
      if (!route.path) { throw new errors.ConfigurationError('All routes require a path'); }

      var levels = namespace.concat([route.name]);

      var children;
      if (route.paths) {
        children = resolveRoutes(route.paths, levels);
        levels.push(INDEX_ROUTE);
      }

      var guid = namespacesToGuid(levels);
      var data = {
        guid: guid,
        method: (route.method || DEFAULT_METHOD).toLowerCase(),
        path: routeToPath(routes, guid)
      };

      conflicts[data.method] = conflicts[data.method] || {};
      conflicts[data.method][route.path] = conflicts[data.method][route.path] || 0;
      conflicts[data.method][route.path]++;

      if (conflicts[data.method][route.path] > 1) {
        throw new errors.ConfigurationError('Multiple routes are defined that handle ' + data.method.toUpperCase() + ' requests at ' + route.path);
      }

      resolved.push(data);

      return children ? resolved.concat(children) : resolved;
    }, []);
  }

  return resolveRoutes(routes, []);
}

/**
 * Transform a route definition into a map between GUIDs and namespaces
 *
 * @param {HimationRouteDefinition[]} routes A route definition
 * @returns {object} A map of route GUIDs to their namespace hierarchies
 */
function routesToGuids(routes) {
  function createGuids(subroutes, namespace) {
    return subroutes.reduce(function(guids, route) {
      var levels = namespace.concat([route.name]);

      if (route.paths) {
        extend(guids, createGuids(route.paths, levels));
        levels.push(INDEX_ROUTE);
      }

      var guid = namespacesToGuid(levels);
      guids[guid] = levels;

      return guids;
    }, {});
  }

  return createGuids(routes, []);
}

/**
 * Determine the name of the route described by a path
 *
 * @param {HimationRoute[]} routes All available routes
 * @param {string} path The path component of a URL
 * @param {string} [method] The request method used to get the path
 * @returns {?HimationRoute} The matching route
 */
function pathToRoute(routes, path, method) {
  var basePath = path.replace(/\/+$/, '');
  var pathMatch = new RegExp('^' + _.escapeRegExp(basePath) + '/?$', 'i');
  var requestMethod = (method || DEFAULT_METHOD).toLowerCase();

  return _.find(routes, function(route) {
    return pathMatch.test(route.path) && route.method === requestMethod;
  }) || null;
}

/**
 * Produce the path for accessing a named route
 *
 * @param {HimationRouteDefinition[]} routes A route definition
 * @param {HimationRouteGUID} guid The unique identifier for the route
 * @returns {string} The path for the route
 * @throws {ConfigurationError} If no path for the route was found
 */
function routeToPath(routes, guid) {
  function resolvePath(subroutes, namespaces) {
    var rootName = _.first(namespaces);
    var matches = subroutes.filter(route => route.name === rootName);

    if (!matches.length) { throw new errors.ConfigurationError('No route named "' + guid + '" was found'); }
    if (matches.length > 1) { throw new errors.ConfigurationError('Multiple routes named "' + guid + '" were found'); }

    var matchedRoute = matches[0];
    var matchedPath = matchedRoute.path;

    if (!matchedPath) { throw new errors.ConfigurationError('No path was found for the route named "' + guid + '"'); }

    var levels = [matchedPath];
    var endpoint = _.last(namespaces) === INDEX_ROUTE ? -1 : namespaces.length;
    var childNames = namespaces.slice(1, endpoint);

    if (childNames.length) {
      levels = levels.concat(resolvePath(matchedRoute.paths || [], childNames));
    }

    return levels;
  }

  var paths = resolvePath(routes, guidToNamespaces(guid));
  return urls.joinPaths(paths);
}

/**
 * Extract the ordered namespaces described by a route GUID
 *
 * @param {HimationRouteGUID} guid A route GUID
 * @returns {string[]} The hierarchy defined by the GUID
 */
function guidToNamespaces(guid) {
  return guid.split(GUID_SEPARATOR);
}

/**
 * Convert a series of namespaces to a route GUID
 *
 * @param {string[]} namespaces The namespace hierarchy for a route
 * @returns {HimationRouteGUID} The GUID for the hierarchy
 */
function namespacesToGuid(namespaces) {
  return namespaces.join(GUID_SEPARATOR);
}

module.exports = {
  defineRoutes: defineRoutes,
  guidToNamespaces: guidToNamespaces,
  namespacesToGuid: namespacesToGuid,
  routesToGuids: routesToGuids,
  pathToRoute: pathToRoute,
  routeToPath: routeToPath
};
