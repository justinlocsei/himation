'use strict';

var express = require('express');
var helmet = require('helmet');

var addRouteAssets = require('chiton/server/middleware/add-route-assets');
var templating = require('chiton/server/templating');
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
  });
}

/**
 * Create an instance of an application server
 *
 * @param {object} options Configuration for the server
 * @param {string} options.assetUrl The URL at which assets are available
 * @param {ChitonRoute[]} options.routes A mapping of route names to URLs
 * @param {string} options.templates The path to the templates directory
 * @returns {Server} An application server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assetUrl) { throw new Error('You must provide the URL for the asset server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }
  if (!settings.templates) { throw new Error('You must specify a path to the templates directory'); }

  var app = express();

  var templates = templating.createEngine(settings.templates);
  templates.express(app);
  app.set('view engine', 'html');

  app.use(helmet());
  app.use(addRouteAssets(settings.assetUrl, settings.routes));

  connectRoutes(app, settings.routes);

  return app;
}

module.exports = {
  create: create
};
