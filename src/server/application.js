'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var helmet = require('helmet');
var nunjucks = require('nunjucks');
var raven = require('raven');

var errors = require('himation/core/errors');

/**
 * Simplify the app's configuration by removing and disabling unused settings
 *
 * @param {express.application} app An application instance
 * @private
 */
function simplifyConfiguration(app) {
  app.disable('etag');
}

/**
 * Configure the app's template engine
 *
 * @param {express.Application} app An application instance
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
 * @param {express.Application} app An application instance
 * @private
 */
function configureSecurity(app) {
  app.use(helmet.frameguard('deny'));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.noCache());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

  app.set('trust proxy', 'loopback');
}

/**
 * Configure request parsing for the application
 *
 * @param {express.Application} app An application instance
 * @private
 */
function configureParsing(app) {
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.use(bodyParser.json({
    strict: true
  }));

  app.use(cookieParser());
}

/**
 * Configure error tracking for the application
 *
 * @param {express.Application} app An application instance
 * @param {string} environment The name of the current application environment
 * @param {string} sentryDsn The Sentry DSN to use
 * @private
 */
function configureErrorTracking(app, environment, sentryDsn) {
  var client = new raven.Client(sentryDsn, {
    environment: environment,
    tags: {environment: environment}
  });

  client.patchGlobal(function() {
    console.log('Exiting due to unhandled exception');
    process.exit(1);
  });

  app.use(raven.middleware.express.requestHandler(client));
  app.use(raven.middleware.express.errorHandler(client));

  app.use(function(req, res, next) {
    res.locals.raven = client;
    next();
  });
}

/**
 * Create an instance of an application server
 *
 * @param {object} options Configuration for the server
 * @param {string} options.environment The name of the current application environment
 * @param {string} [options.sentryDsn] The Sentry DSN to use
 * @param {string} options.templatesDirectory The path to the templates directory
 * @returns {express.Application} An application server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.templatesDirectory) {
    throw new errors.ConfigurationError('You must provide the path to the templates directory');
  }

  var app = express();

  if (settings.sentryDsn) {
    configureErrorTracking(app, settings.environment, settings.sentryDsn);
  }

  simplifyConfiguration(app);
  configureTemplates(app, settings.templatesDirectory);
  configureSecurity(app);
  configureParsing(app);

  return app;
}

module.exports = {
  create: create
};
