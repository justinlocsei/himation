'use strict';

var express = require('express');
var helmet = require('helmet');

var templateEngines = require('./template-engines');
var uiBridge = require('./ui-bridge');

/**
 * Create an instance of an API server
 *
 * @param {Object} options Configuration for the server
 * @param {Object} options.assets A mapping of asset-bundle IDs to URLs
 * @param {Object} options.routes A mapping of route names to URLs
 * @param {string} options.templates The path to the templates directory
 * @param {string} options.ui The path to the UI JS directory
 * @returns {Server} An API server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assets) { throw new Error('You must provide asset URLs for the server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }
  if (!settings.templates) { throw new Error('You must specify a path to the templates directory'); }
  if (!settings.ui) { throw new Error('You must specify a path to the UI JS directory'); }

  var app = express();
  app.use(helmet());

  var templates = templateEngines.nunjucks(settings.templates);
  templates.express(app);

  var ui = new uiBridge.Loader(settings.ui);
  var About = ui.require('components/about');
  var Index = ui.require('components/index');

  var routes = settings.routes;

  app.get(routes.index, function(req, res) { res.render('public.html'); });
  app.get(routes.about, function(req, res) { res.render('public.html'); });

  return app;
}

module.exports = {
  create: create
};
