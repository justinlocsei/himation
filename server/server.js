'use strict';

var express = require('express');
var helmet = require('helmet');
var nunjucks = require('nunjucks');

var endpoints = require('./endpoints');

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

  nunjucks.configure(settings.templates, {
    autoescape: true,
    express: app,
    lstripBlocks: true,
    trimBlocks: true
  });

  endpoints.map(app, settings.routes, settings.assets);

  return app;
}

module.exports = {
  create: create
};
