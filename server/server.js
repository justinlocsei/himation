'use strict';

var express = require('express');
var helmet = require('helmet');

var pages = require('./ui/pages');
var templateEngines = require('./template-engines');

/**
 * Add route mappings to an application
 *
 * @param {Server} app An application instane
 * @param {Object} routes A mapping of route IDs to URLs
 * @private
 */
function route(app, routes) {
  app.get(routes.index, function(req, res) {
    res.render('public', {content: pages.index()});
  });

  app.get(routes.about, function(req, res) {
    res.render('public', {content: pages.about()});
  });
}

/**
 * Create an instance of an API server
 *
 * @param {Object} options Configuration for the server
 * @param {Object} options.assets A mapping of asset-bundle IDs to URLs
 * @param {Object} options.routes A mapping of route names to URLs
 * @param {string} options.templates The path to the templates directory
 * @returns {Server} An API server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assets) { throw new Error('You must provide asset URLs for the server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }
  if (!settings.templates) { throw new Error('You must specify a path to the templates directory'); }

  var app = express();
  app.use(helmet());

  var templates = templateEngines.nunjucks(settings.templates);
  templates.express(app);
  app.set('view engine', 'html');

  route(app, settings.routes);

  return app;
}

module.exports = {
  create: create
};
