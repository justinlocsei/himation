'use strict';

var _ = require('lodash');
var extend = require('extend');

var COMMONS_SEPARATOR = '--';
var NAMESPACE_SEPARATOR = '.';

var COMMONS_ROOT = 'commons';
var ROOT_MODULE = 'index';

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
 * @returns {object} A mapping of entry points to modules
 */
function routesToEntryPoints(routes, options) {
  var settings = extend({
    modules: [],
    root: ''
  }, options || {});

  function createEntryPoints(subroutes, root, parentModules, namespaces) {
    return subroutes.reduce(function(points, route) {
      var modules = parentModules.filter(path => path !== root);

      var routeName = route.name === root ? '' : route.name;
      if (routeName) { modules.push(routeName); }
      if (route.paths || !routeName) { modules.push(ROOT_MODULE); }

      var namespace = namespaces.concat([route.name]);
      if (route.paths) { namespace.push(ROOT_MODULE); }

      var guid = namespace.join(NAMESPACE_SEPARATOR);
      points[guid] = './' + modules.join('/');

      if (route.paths) {
        extend(true, points, createEntryPoints(
          route.paths,
          root,
          parentModules.concat([route.name]),
          namespaces.concat([route.name])
        ));
      }

      return points;
    }, {});
  }

  return createEntryPoints(routes, settings.root, settings.modules, []);
}

module.exports = {
  entryPointsToCommonsChunks: entryPointsToCommonsChunks,
  routesToEntryPoints: routesToEntryPoints
};
