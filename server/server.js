'use strict';

var express = require('express');
var helmet = require('helmet');

var components = require('./components');
var templateEngines = require('./template-engines');

/**
 * Create an instance of an API server
 *
 * @param {Object} options Configuration for the server
 * @param {Object} options.assets A mapping of asset-bundle IDs to URLs
 * @param {string} options.components The path to the components directory
 * @param {Object} options.routes A mapping of route names to URLs
 * @param {string} options.templates The path to the templates directory
 * @returns {Server} An API server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assets) { throw new Error('You must provide asset URLs for the server'); }
  if (!settings.components) { throw new Error('You must specify a path to the components directory'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }
  if (!settings.templates) { throw new Error('You must specify a path to the templates directory'); }

  var app = express();
  app.use(helmet());

  var templates = templateEngines.nunjucks(settings.templates);
  templates.express(app);

  var loader = new components.Loader(settings.components);
  var About = loader.load('about');
  var Index = loader.load('index');

  var routes = settings.routes;

  app.get(routes.index, function(req, res) {
    res.render('public.html');
  });

  app.get(routes.about, function(req, res) {
    res.render('public.html');
  });

  return app;
}

module.exports = {
  create: create
};
