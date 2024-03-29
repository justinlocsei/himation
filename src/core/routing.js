'use strict';

var escapeRegExp = require('lodash/escapeRegExp');
var find = require('lodash/find');
var first = require('lodash/first');
var last = require('lodash/last');

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
 * @property {boolean} isAnchor Whether the route is for an anchor on a page
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
  * @param {HimationRouteDefinition[]} definitions Route definitions
  * @returns {HimationRoute[]} A flat list of routes
  */
function defineRoutes(definitions) {
  var conflicts = {};

  function resolveRoutes(branch, namespace) {
    return branch.reduce(function(resolved, route) {
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
        isAnchor: route.path.indexOf('#') === 0,
        method: (route.method || DEFAULT_METHOD).toLowerCase(),
        path: resolveRouteDefinitionPath(definitions, guid)
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

  return resolveRoutes(definitions, []);
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
  var pathMatch = new RegExp('^' + escapeRegExp(basePath) + '/?$', 'i');
  var requestMethod = (method || DEFAULT_METHOD).toLowerCase();

  return find(routes, function(route) {
    return pathMatch.test(route.path) && route.method === requestMethod;
  }) || null;
}

/**
 * Resolve a route GUID to a route
 *
 * @param {HimationRoute[]} routes All available routes
 * @param {HimationRouteGUID} guid A route GUID
 * @returns {HimationRoute} The route matching the GUID
 * @throws {ConfigurationError} If the route is not defined
 */
function guidToRoute(routes, guid) {
  var resolved = find(routes, route => route.guid === guid);
  if (!resolved) {
    throw new errors.ConfigurationError('The ' + guid + ' route is not defined');
  }

  return resolved;
}

/**
 * Resolve the full path by which a defined route can be accessed
 *
 * @param {HimationRouteDefinition[]} definitions Routes definitions
 * @param {HimationRouteGUID} guid The unique identifier for the route
 * @returns {string} The path for the route
 * @throws {ConfigurationError} If no path for the route was found
 */
function resolveRouteDefinitionPath(definitions, guid) {
  function resolvePath(nestedDefinitions, namespaces) {
    var rootName = first(namespaces);
    var matches = nestedDefinitions.filter(route => route.name === rootName);

    if (!matches.length) { throw new errors.ConfigurationError('No route named "' + guid + '" was found'); }
    if (matches.length > 1) { throw new errors.ConfigurationError('Multiple routes named "' + guid + '" were found'); }

    var matchedRoute = matches[0];
    var matchedPath = matchedRoute.path;

    if (!matchedPath) { throw new errors.ConfigurationError('No path was found for the route named "' + guid + '"'); }

    var levels = [matchedPath];
    var endpoint = last(namespaces) === INDEX_ROUTE ? -1 : namespaces.length;
    var childNames = namespaces.slice(1, endpoint);

    if (childNames.length) {
      levels = levels.concat(resolvePath(matchedRoute.paths || [], childNames));
    }

    return levels;
  }

  var paths = resolvePath(definitions, guidToNamespaces(guid));
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
  guidToRoute: guidToRoute,
  namespacesToGuid: namespacesToGuid,
  pathToRoute: pathToRoute,
  resolveRouteDefinitionPath: resolveRouteDefinitionPath
};
