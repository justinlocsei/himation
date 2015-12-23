'use strict';

var _ = require('lodash');
var express = require('express');
var helmet = require('helmet');

var build = require('chiton/server/build');
var templateEngines = require('chiton/server/template-engines');
var routing = require('chiton/server/routing');
var urls = require('chiton/server/urls');

var pages = build.bridge('pages');
var uiBuild = build.stats('ui');

// A map between asset groups and file extensions
var ASSET_GROUPS = {
  javascripts: 'js',
  stylesheets: 'css'
};

/**
 * Create a middleware function that adds assets to the template context
 *
 * @param {string} host The URL at which assets are hosted
 * @param {ChitonRoutes} routes A mapping of route IDs to URLs
 * @param {ChitonSettings} settings The environment settings
 * @returns {function} The asset-injector middleware
 * @private
 */
function assetInjector(host, routes) {
  return function(req, res, next) {
    var route = routing.reverse(routes, req.path);

    if (route) {
      _.each(ASSET_GROUPS, function(extension, group) {
        res.locals[group] = ['commons', route].reduce(function(files, entry) {
          var assets = build.assets(uiBuild, entry, extension);
          return files.concat(assets.map(function(asset) {
            return urls.absolute(asset, host);
          }));
        }, []);
      });
    }

    next();
  };
}

/**
 * Add route mappings to an application
 *
 * @param {Server} app An application instance
 * @param {ChitonRoutes} routes A mapping of route IDs to URLs
 * @private
 */
function connectRoutes(app, routes) {
  app.get(routing.url(routes, 'index'), function(req, res) {
    res.render('public', {content: pages.index()});
  });

  app.get(routing.url(routes, 'about'), function(req, res) {
    res.render('public', {content: pages.about()});
  });
}

/**
 * Create an instance of an application server
 *
 * @param {object} options Configuration for the server
 * @param {string} options.assetUrl The URL at which assets are available
 * @param {ChitonRoutes} options.routes A mapping of route names to URLs
 * @param {string} options.templates The path to the templates directory
 * @returns {Server} An application server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assetUrl) { throw new Error('You must provide the URL for the asset server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }
  if (!settings.templates) { throw new Error('You must specify a path to the templates directory'); }

  var app = express();

  var templates = templateEngines.nunjucks(settings.templates);
  templates.express(app);
  app.set('view engine', 'html');

  app.use(helmet());
  app.use(assetInjector(settings.assetUrl, settings.routes));

  connectRoutes(app, settings.routes);

  return app;
}

module.exports = {
  create: create
};
