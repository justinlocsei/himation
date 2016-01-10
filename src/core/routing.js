'use strict';

var _ = require('lodash');
var extend = require('extend');

var errors = require('chiton/core/errors');
var urls = require('chiton/core/urls');

var GUID_SEPARATOR = '.';

var INDEX_ROUTE = 'index';

var LEADING_SLASH_MATCH = new RegExp('^/');

var DEFAULT_METHOD = 'get';

/**
 * A Chiton route definition
 *
 * @typedef {object} ChitonRouteDefinition
 * @property {string} [method] The HTTP method to use for accessing the URL
 * @property {string} name The internal ID for the route
 * @property {string} path The path to the route
 * @property {ChitonRouteDefinition[]} paths Child paths within the route's namespace
 */

/**
 * A Chiton route
 *
 * @typedef {object} ChitonRoute
 * @property {ChitonRouteGUID} guid The route's GUID
 * @property {string} method The HTTP method to use for accessing the URL
 * @property {string[]} hierarchy The individual component's of the route's GUID
 * @property {string} path The full path to the route
 */

/**
 * A GUID for a Chiton route
 *
 * Route GUIDS are guaranteed to not conflict with any other routes, and define
 * their hierarchy as a string separated by dots.
 *
 * @typedef {string} ChitonRouteGUID
 */

 /**
  * Transform route definitions into routes
  *
  * @param {ChitonRouteDefinition[]} routes Route definitions
  * @returns {ChitonRoute[]} A flat list of routes
  */
function defineRoutes(routes) {
  function resolveRoutes(subroutes, namespace) {
    return subroutes.reduce(function(resolved, route) {
      var levels = namespace.concat([route.name]);

      var children;
      if (route.paths) {
        children = resolveRoutes(route.paths, levels);
        levels.push(INDEX_ROUTE);
      }

      var guid = namespacesToGuid(levels);
      resolved.push({
        guid: guid,
        hierarchy: levels,
        method: (route.method || DEFAULT_METHOD).toLowerCase(),
        path: routeToPath(routes, guid)
      });

      return children ? resolved.concat(children) : resolved;
    }, []);
  }

  return resolveRoutes(routes, []);
}

/**
 * Transform a route definition into a map between GUIDs and namespaces
 *
 * @param {ChitonRouteDefinition[]} routes A route definition
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
 * @param {ChitonRouteDefinition[]} routes A route definition
 * @param {string} path The path component of a URL
 * @param {string} [method] The request method used to get the path
 * @returns {?ChitonRouteGUID} The GUID of the route
 * @throws {ConfigurationError} If multiple routes match the given path
 * @throws {ConfigurationError} If the matching route lacks a name
 */
function pathToRoute(routes, path, method) {
  var methodMatch = new RegExp('^' + _.escapeRegExp(method || DEFAULT_METHOD) + '$', 'i');

  function resolveRoute(subroutes, subpath) {
    var matches = subroutes.filter(function(route) {
      var pathMatch = new RegExp('^' + _.escapeRegExp(route.path) + '/?', 'i');
      var matchesMethod = route.paths ? true : methodMatch.test(route.method || DEFAULT_METHOD);
      return pathMatch.test(subpath) && matchesMethod;
    });

    if (matches.length > 1) {
      var uniquePaths = _.uniq(_.pluck(matches, 'path'));
      if (uniquePaths.length !== matches.length) {
        throw new errors.ConfigurationError('Multiple routes match the path "' + subpath + '"');
      }
    } else if (!matches.length) {
      return [];
    }

    var match;
    if (matches.length) {
      match = _.first(_.sortBy(matches, route => route.path.length * -1));
    } else {
      match = matches[0];
    }

    var namespaces = [match.name];
    if (!namespaces[0]) {
      throw new errors.ConfigurationError('No name was given to the route with a path of "' + match.path + '"');
    }

    var remainder = subpath.substring(match.path.length).replace(LEADING_SLASH_MATCH, '');
    if (remainder) {
      var subnamespaces = resolveRoute(match.paths || [], remainder);
      namespaces = subnamespaces.length ? namespaces.concat(subnamespaces) : [];
    } else if (match.paths) {
      namespaces.push(INDEX_ROUTE);
    }

    return namespaces;
  }

  var names = resolveRoute(routes, path);
  return names.length ? namespacesToGuid(names) : null;
}

/**
 * Produce the path for accessing a named route
 *
 * @param {ChitonRouteDefinition[]} routes A route definition
 * @param {ChitonRouteGUID} guid The unique identifier for the route
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
 * @param {ChitonRouteGUID} guid A route GUID
 * @returns {string[]} The hierarchy defined by the GUID
 */
function guidToNamespaces(guid) {
  return guid.split(GUID_SEPARATOR);
}

/**
 * Convert a series of namespaces to a route GUID
 *
 * @param {string[]} namespaces The namespace hierarchy for a route
 * @returns {ChitonRouteGUID} The GUID for the hierarchy
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
