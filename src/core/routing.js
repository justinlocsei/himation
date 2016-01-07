'use strict';

var _ = require('lodash');
var extend = require('extend');

var ConfigurationError = require('chiton/core/errors/configuration-error');
var urls = require('chiton/core/urls');

var GUID_SEPARATOR = '.';

var INDEX_ROUTE = 'index';

var LEADING_SLASH_MATCH = new RegExp('^/');

/**
 * A Chiton route definition
 *
 * @typedef {object} ChitonRoute
 * @property {string} name The internal ID for the route
 * @property {string} path The path to the route
 * @property {ChitonRoute[]} paths Child paths within the route's namespace
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
 * Transform a route definition into a map between GUIDs and namespaces
 *
 * @param {ChitonRoute[]} routes A route definition
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
 * @param {ChitonRoute[]} routes A route definition
 * @param {string} path The path component of a URL
 * @returns {?ChitonRouteGUID} The GUID of the route
 * @throws {ConfigurationError} If multiple routes match the given path
 * @throws {ConfigurationError} If the matching route lacks a name
 */
function pathToRoute(routes, path) {
  function resolveRoute(subroutes, subpath) {
    var matches = subroutes.filter(function(route) {
      var match = new RegExp('^' + route.path + '/?', 'i');
      return match.test(subpath);
    });

    if (matches.length > 1) {
      var uniquePaths = _.uniq(_.pluck(matches, 'path'));
      if (uniquePaths.length !== matches.length) {
        throw new ConfigurationError('Multiple routes match the path "' + subpath + '"');
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
      throw new ConfigurationError('No name was given to the route with a path of "' + match.path + '"');
    }

    var remainder = subpath.substring(match.path.length).replace(LEADING_SLASH_MATCH, '');
    if (remainder) {
      var subnamespaces = pathToRoute(match.paths || [], remainder);
      namespaces = subnamespaces ? namespaces.concat(subnamespaces) : [];
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
 * @param {ChitonRoute[]} routes A route definition
 * @param {ChitonRouteGUID} guid The unique identifier for the route
 * @returns {string} The path for the route
 * @throws {ConfigurationError} If no path for the route was found
 */
function routeToPath(routes, guid) {
  function resolvePath(subroutes, namespaces) {
    var rootName = _.first(namespaces);
    var matches = subroutes.filter(route => route.name === rootName);

    if (!matches.length) { throw new ConfigurationError('No route named "' + guid + '" was found'); }
    if (matches.length > 1) { throw new ConfigurationError('Multiple routes named "' + guid + '" were found'); }

    var matchedRoute = matches[0];
    var matchedPath = matchedRoute.path;

    if (!matchedPath) { throw new ConfigurationError('No path was found for the route named "' + guid + '"'); }

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
  guidToNamespaces: guidToNamespaces,
  namespacesToGuid: namespacesToGuid,
  routesToGuids: routesToGuids,
  pathToRoute: pathToRoute,
  routeToPath: routeToPath
};
