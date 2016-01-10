'use strict';

var _ = require('lodash');
var extend = require('extend');

var routing = require('chiton/core/routing');

/**
 * Create a series of definitions for commons chunks for entry points
 *
 * This expects to receive a mapping of entry points whose keys are route GUIDs,
 * which allows entry points that share a namespace to be determined.
 *
 * @param {object} points A mapping of entry-point names to module paths
 * @returns {object[]} A series of options used to create commons-chunks plugins
 */
function entryPointsToCommonsChunks(points) {
  var entries = Object.keys(points);

  function createCommonsChunks(depth) {
    var allNamespaces = entries.map(name => routing.guidToNamespaces(name).slice(0, depth));
    var candidates = allNamespaces.filter(namespace => namespace.length === depth);
    var prefixes = _.uniq(candidates.map(candidate => routing.namespacesToGuid(candidate)));
    var namespaces = prefixes.map(search => routing.guidToNamespaces(search));

    if (!namespaces.length) { return []; }

    var chunks = namespaces.reduce(function(result, namespace) {
      var matches = entries.filter(function(entry) {
        var prefix = routing.guidToNamespaces(entry);
        return _.isEqual(prefix.slice(0, depth), namespace);
      });

      if (matches.length > 1) {
        var nameParts = ['commons'].concat(namespace);
        result.push({
          chunks: matches,
          filename: nameParts.join('.') + '-[hash].js',
          name: nameParts.join('.')
        });
      }

      return result;
    }, []);

    return chunks.concat(createCommonsChunks(depth + 1));
  }

  return createCommonsChunks(1);
}

/**
 * Create a map of entry-point names to modules from a route definition
 *
 * This can accept an optional name for the root route, which will be treated as
 * a reference to the root directory for the modules.  The entry-point IDs
 * created by this function will be route GUIDs.
 *
 * @param {ChitonRoute[]} routes All available routes
 * @param {object} [options] Options for generating the map of entries
 * @param {string[]} options.modules The hierarchy to use for each module
 * @param {string} options.root The name of the root route
 * @returns {object} A mapping of entry points to module paths
 */
function routesToEntryPoints(routes, options) {
  var settings = extend({
    modules: [],
    root: ''
  }, options || {});

  var parentModules = ['.'].concat(settings.modules);

  return routes.reduce(function(points, route) {
    var guid = route.guid;
    var levels = routing.guidToNamespaces(guid);

    var split = levels[0] === settings.root ? 1 : 0;
    var modules = levels.slice(split);
    points[guid] = parentModules.concat(modules).join('/');

    return points;
  }, {});
}

module.exports = {
  entryPointsToCommonsChunks: entryPointsToCommonsChunks,
  routesToEntryPoints: routesToEntryPoints
};
