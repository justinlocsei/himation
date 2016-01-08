'use strict';

var routing = require('chiton/core/routing');
var urls = require('chiton/core/urls');

// A map between named asset groups and their file extensions
var ASSET_GROUPS = {
  javascripts: 'js',
  stylesheets: 'css'
};

/**
 * Create a middleware function that adds assets to the template context
 *
 * This resolves the path of each request to a named route.  If a path matches a
 * route, that route's assets are fetched from the build stats, and transformed
 * into absolute URLs rooted in the asset host.
 *
 * @param {ChitonBuildStats} stats Information on the webpack build for the assets
 * @param {string} host The URL at which assets are hosted
 * @param {ChitonRoute[]} routes The server's route definitions
 * @returns {function} The asset-injector middleware
 */
function create(stats, host, routes) {
  return function(req, res, next) {
    var route = routing.pathToRoute(routes, req.path);
    if (!route) { return next(); }

    res.locals.assets = Object.keys(ASSET_GROUPS).reduce(function(groups, group) {
      var extensionMatcher = new RegExp('.' + ASSET_GROUPS[group] + '$');
      var assets = (stats.assets[route] || []).filter(file => extensionMatcher.test(file));
      groups[group] = assets.map(asset => urls.relativeToAbsolute(asset, host));

      return groups;
    }, {});

    next();
  };
}

module.exports = {
  create: create
};
