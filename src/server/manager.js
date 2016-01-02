'use strict';

var extend = require('extend');
var http = require('http');
var https = require('https');

var environments = require('chiton/config/environments');
var paths = require('chiton/core/paths');
var routes = require('chiton/config/routes');
var urls = require('chiton/core/urls');

/**
 * Start the server
 *
 * If a callback is provided, it will be called with the address of the server
 * once it has been bound.
 *
 * @param {object} options Options for starting the server
 * @param {string} environment The environment in which to run the server
 * @param {function} onBind A function to call when the server is available
 * @returns {Server} The listening server
 */
function start(options) {
  var settings = extend({
    environment: null,
    onBind: function() {}
  }, options || {});

  var config = environments.load(settings.environment);
  var servers = config.servers;

  var assetUrl = urls.expandHost(servers.assets.host, {
    port: servers.assets.port,
    protocol: servers.assets.protocol
  });

  var application = require('chiton/server/application');
  var app = application.create({
    assetUrl: assetUrl,
    routes: routes,
    templates: paths.ui.templates
  });

  var serverFactory = servers.app.protocol === 'https' ? https : http;
  var server = serverFactory.createServer(app);

  server.listen(servers.app.port, servers.app.host, function() {
    config.onBind(this.address());
  });

  return server;
}

module.exports = {
  start: start
};
