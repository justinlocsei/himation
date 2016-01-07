'use strict';

var express = require('express');
var helmet = require('helmet');
var nunjucks = require('nunjucks');

var ConfigurationError = require('chiton/core/errors/configuration-error');

/**
 * Configure the app's template engine
 *
 * @param {Server} app An application instance
 * @param {string} directory The path to the template directory
 * @private
 */
function configureTemplates(app, directory) {
  var loader = new nunjucks.FileSystemLoader(directory);

  var env = new nunjucks.Environment(loader, {
    autoescape: true,
    throwOnUndefined: true
  });

  env.express(app);

  app.set('view engine', 'html');
}

/**
 * Configure basic security for the application
 *
 * @param {Server} app An application instance
 * @private
 */
function configureSecurity(app) {
  app.use(helmet.frameguard('deny'));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.noCache());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
}

/**
 * Create an instance of an application server
 *
 * @param {object} options Configuration for the server
 * @param {string} options.templatesDirectory The path to the templates directory
 * @returns {Server} An application server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.templatesDirectory) { throw new ConfigurationError('You must provide the path to the templates directory'); }

  var app = express();

  configureTemplates(app, settings.templatesDirectory);
  configureSecurity(app);

  return app;
}

module.exports = {
  create: create
};
