'use strict';

var escapeRegExp = require('lodash/escapeRegExp');

var routing = require('himation/core/routing');
var urls = require('himation/core/urls');

// A map between named asset groups and their file extensions
var ASSET_GROUPS = {
  javascripts: ['.js'],
  stylesheets: ['.css']
};

// A map between asset groups and preload destinations
var ASSET_PRELOAD_DESTINATIONS = {
  javascripts: 'script',
  stylesheets: 'style'
};

/**
 * Create a middleware function that adds assets to the template context
 *
 * This resolves the path of each request to a named route.  If a path matches a
 * route, that route's assets are fetched from the build manifest, and
 * transformed into absolute URLs rooted in the asset host.
 *
 * @param {HimationBuildManifest} manifest The build manifest for the assets
 * @param {string} host The URL at which assets are hosted
 * @param {HimationRoute[]} routes The server's route definitions
 * @returns {function} The asset-injector middleware
 */
function create(manifest, host, routes) {
  return function(req, res, next) {
    var route = routing.pathToRoute(routes, req.path, req.method);
    if (!route) { return next(); }

    var assetTypes = Object.keys(ASSET_GROUPS).reduce(function(groups, group) {
      var matches = ASSET_GROUPS[group].map(extension => escapeRegExp(extension) + '$');
      var extensionMatcher = new RegExp(matches.join('|'));

      var assets = (manifest.assets[route.guid] || []).filter(file => extensionMatcher.test(file));
      var paths = assets.map(asset => urls.joinPaths([manifest.url, asset]));
      groups[group] = paths.map(path => urls.relativeToAbsolute(path, host));

      return groups;
    }, {});

    var linkHeaders = Object.keys(assetTypes).reduce(function(headers, type) {
      return headers.concat(assetTypes[type].map(function(assetUrl) {
        return '<' + assetUrl + '>; rel=preload; as=' + ASSET_PRELOAD_DESTINATIONS[type];
      }));
    }, []);

    res.locals.assets = assetTypes;
    res.set('Link', linkHeaders);

    return next();
  };
}

module.exports = {
  create: create
};
