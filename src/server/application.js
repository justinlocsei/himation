'use strict';

var express = require('express');
var nunjucks = require('nunjucks');

var addRouteAssets = require('chiton/server/middleware/add-route-assets');
var ConfigurationError = require('chiton/core/errors/configuration-error');
var paths = require('chiton/core/paths');
var routes = require('chiton/core/routes');
var routing = require('chiton/server/routing');

/**
 * Configure the app's template engine
 *
 * @param {Server} app An application instance
 * @private
 */
function configureTemplates(app) {
  var loader = new nunjucks.FileSystemLoader(paths.ui.templates);
  var env = new nunjucks.Environment(loader, {
    autoescape: true,
    lstripBlocks: true,
    trimBlocks: true
  });

  env.express(app);

  app.set('view engine', 'html');
}

/**
 * Configure the asset-serving middleware for the app
 *
 * @param {Server} app An application instance
 * @param {string} assetUrl The URL at which assets are available
 * @private
 */
function configureAssets(app, assetUrl) {
  var injector = addRouteAssets(assetUrl, routes);
  app.use(injector);
}

/**
 * Add route mappings to an application
 *
 * @param {Server} app An application instance
 * @private
 */
function configureRoutes(app) {
  app.get(routing.routeToPath(routes, 'index'), (req, res) => res.render('public'));
  app.get(routing.routeToPath(routes, 'about'), (req, res) => res.render('public'));
}

/**
 * Create an instance of an application server
 *
 * @param {object} options Configuration for the server
 * @param {string} options.assetUrl The URL at which assets are available
 * @returns {Server} An application server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assetUrl) { throw new ConfigurationError('You must provide the URL for the asset server'); }

  var app = express();

  configureTemplates(app);
  configureAssets(app, settings.assetUrl);
  configureRoutes(app);

  return app;
}

module.exports = {
  create: create
};
