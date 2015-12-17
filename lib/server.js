'use strict';

var express = require('express');
var helmet = require('helmet');
var nunjucks = require('nunjucks');

var endpoints = require('./endpoints');

/**
 * Start the API server
 *
 * @param {Object} options Configuration for the server
 * @param {string} options.host The host on which to listen
 * @param {number} options.port The port on which to listen
 * @param {Object} options.routes A mapping of route names to URLs
 * @param {string} options.templates The path to the templates directory
 */
function serve(options) {
  var settings = options || {};

  if (!settings.host) { throw new Error('You must specify a host for the server'); }
  if (!settings.port) { throw new Error('You must specify a port for the server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }
  if (!settings.templates) { throw new Error('You must specify a path to the templates directory'); }

  var app = express();
  app.use(helmet());

  nunjucks.configure(settings.templates, {
    autoescape: true,
    express: app,
    lstripBlocks: true,
    trimBlocks: true
  });

  var routes = settings.routes;
  app.get(routes.urls.index, endpoints.index);

  return app.listen(settings.port, settings.host);
}

module.exports = {
  serve: serve
};
