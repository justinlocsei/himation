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
 * @param {ChitonBuildStats} stats Information on the webpack build for the assets
 * @param {string} host The URL at which assets are hosted
 * @param {ChitonRoute[]} routes The server's route definitions
 * @returns {function} The asset-injector middleware
 */
function assets(stats, host, routes) {
  return function(req, res, next) {
    var route = routing.pathToRoute(routes, req.path);
    if (!route) { return next(); }

    res.locals.assets = Object.keys(ASSET_GROUPS).reduce(function(groups, group) {
      var paths = build.assets(stats, route, ASSET_GROUPS[group]);
      groups[group] = paths.map(path => urls.absolute(path, host));

      return groups;
    }, {});

    next();
  };
}

module.exports = assets;
