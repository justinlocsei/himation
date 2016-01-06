'use strict';

var _ = require('lodash');
var extend = require('extend');

var routing = require('chiton/core/routing');

var COMMONS_SEPARATOR = '--';
var NAMESPACE_SEPARATOR = '.';

var COMMONS_ROOT = 'commons';

/**
 * Create a series of definitions for commons chunks for entry points
 *
 * This expects the given entry points to match the output format of the
 * `routesToEntryPoints` function, which uses a dot-separated notation to
 * express hierarchy. Each group of shared levels will receive its own commons
 * chunk.
 *
 * @param {object} points A mapping of entry-point names to module paths
 * @returns {object[]} A series of options used to create commons-chunks plugins
 */
function entryPointsToCommonsChunks(points) {
  var names = Object.keys(points);

  function createCommonsChunks(depth) {
    var namespaces = names.map(name => name.split(NAMESPACE_SEPARATOR).slice(0, depth));
    var candidates = namespaces.filter(namespace => namespace.length === depth);
    var searches = _.uniq(candidates.map(candidate => candidate.join(NAMESPACE_SEPARATOR)));
    var matchers = searches.map(search => new RegExp('^' + search + NAMESPACE_SEPARATOR));

    if (!matchers.length) { return []; }

    var chunks = matchers.reduce(function(result, matcher, i) {
      var matches = names.filter(name => matcher.test(name));

      if (matches.length > 1) {
        var levels = searches[i].split(NAMESPACE_SEPARATOR);
        result.push({
          chunks: matches,
          filename: [COMMONS_ROOT].concat(levels, ['[hash].js']).join(COMMONS_SEPARATOR),
          name: [COMMONS_ROOT].concat(levels).join(NAMESPACE_SEPARATOR)
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
 * a reference to the root directory for the modules.
 *
 * @param {ChitonRoute[]} routes A route definition
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

  var guids = routing.routesToGuids(routes);
  return Object.keys(guids).reduce(function(points, guid) {
    var split = guids[guid][0] === settings.root ? 1 : 0;
    var modules = guids[guid].slice(split);
    points[guid] = parentModules.concat(modules).join('/');

    return points;
  }, {});
}

module.exports = {
  entryPointsToCommonsChunks: entryPointsToCommonsChunks,
  routesToEntryPoints: routesToEntryPoints
};
