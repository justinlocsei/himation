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
 * `entries` function, which uses a dot-separated notation to express hierarchy.
 * Each group of shared levels will receive its own commons chunk.
 *
 * @param {object} points A mapping of entry-point names to module paths
 * @param {number} [depth] The namespace depth to use
 * @returns {object[]} A series of options used to create commons-chunks plugins
 */
function commons(points, depth) {
  var level = depth || 1;

  var names = Object.keys(points);
  var namespaces = names.map(name => name.split(NAMESPACE_SEPARATOR).slice(0, level));
  var candidates = namespaces.filter(namespace => namespace.length === level);
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

  return chunks.concat(commons(points, level + 1));
}

/**
 * Create a map of entry-point names to modules from a route definition
 *
 * This can accept an optional name for the root route, which will be treated as
 * a reference to the root directory for the modules.
 *
 * @param {ChitonRoute[]} routes A route definition
 * @param {object} [options] Options for generating the map of entries
 * @param {string[]} options.module The hierarchy to use for each module
 * @param {string[]} options.namespace The namespace hierarchy to use for each entry point
 * @param {string} options.root The name of the root route
 * @returns {object} A mapping of entry points to modules
 */
function entries(routes, options) {
  var settings = extend({
    module: [],
    namespace: [],
    root: ''
  }, options || {});

  return routes.reduce(function(points, route) {
    var modules = settings.module.filter(path => path !== settings.root);
    var routeName = route.name === settings.root ? '' : route.name;
    if (routeName) { modules.push(routeName); }
    if (route.paths || !routeName) { modules.push(ROOT_MODULE); }

    var namespaces = settings.namespace.concat([route.name]);
    if (route.paths) { namespaces.push(ROOT_MODULE); }

    var guid = namespaces.join(NAMESPACE_SEPARATOR);
    points[guid] = './' + modules.join('/');

    if (route.paths) {
      extend(true, points, entries(route.paths, {
        module: settings.module.concat([route.name]),
        namespace: settings.namespace.concat([route.name]),
        root: settings.root
      }));
    }

    return points;
  }, {});
}

module.exports = {
  commons: commons,
  entries: entries
};
