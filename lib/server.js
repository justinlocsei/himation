'use strict';

var express = require('express');
var helmet = require('helmet');

/**
 * Apply middleware to an application
 *
 * @param {Server} app An application instance
 */
function configure(app) {
  app.use(helmet());
}

/**
 * Assign routes to an application
 *
 * @param {Server} app An application instance
 * @param {Object} routes A mapping of route names to URLs
 */
function route(app, routes) {
  app.get(routes.index, function(req, res) {
    res.send('Index');
  });
}

/**
 * Start the API server
 *
 * @param {Object} options Configuration for the server
 * @param {string} options.host The host on which to listen
 * @param {number} options.port The port on which to listen
 * @param {Object} options.routes A mapping of route names to URLs
 */
function serve(options) {
  var settings = options || {};

  if (!settings.host) { throw new Error('You must specify a host for the server'); }
  if (!settings.port) { throw new Error('You must specify a port for the server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }

  var app = express();
  configure(app);
  route(app, settings.routes);

  return app.listen(settings.port, settings.host);
}

module.exports = {
  serve: serve
};
