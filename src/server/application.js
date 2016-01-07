'use strict';

var express = require('express');
var helmet = require('helmet');
var nunjucks = require('nunjucks');

var addRouteAssets = require('chiton/server/middleware/add-route-assets');
var paths = require('chiton/core/paths');
var routing = require('chiton/server/routing');

/**
 * Add route mappings to an application
 *
 * @param {Server} app An application instance
 * @param {ChitonRoute[]} routes A mapping of route IDs to URLs
 * @private
 */
function connectRoutes(app, routes) {
  app.get(routing.routeToPath(routes, 'index'), function(req, res) {
    res.render('public');
  });

  app.get(routing.routeToPath(routes, 'about'), function(req, res) {
    res.render('public');
  })
}

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
 * Create an instance of an application server
 *
 * @param {object} options Configuration for the server
 * @param {string} options.assetUrl The URL at which assets are available
 * @param {ChitonRoute[]} options.routes A mapping of route names to URLs
 * @returns {Server} An application server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assetUrl) { throw new Error('You must provide the URL for the asset server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }

  var app = express();

  configureTemplates(app);

  app.use(helmet());
  app.use(addRouteAssets(settings.assetUrl, settings.routes));

  connectRoutes(app, settings.routes);

  return app;
}

module.exports = {
  create: create
};
