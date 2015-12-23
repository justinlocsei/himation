'use strict';

var http = require('http');
var https = require('https');

var cli = require('chiton/config/cli');
var environments = require('chiton/config/environments');
var paths = require('chiton/core/paths');
var routes = require('chiton/config/routes');
var urls = require('chiton/server/urls');

/**
 * Start the server
 *
 * If a callback is provided, it will be called with the address of the server
 * once it has been bound.
 *
 * @param {function} callback A function to call when the server is available
 * @returns {Server} The listening server
 */
function start(callback) {
  var onBind = callback || function() {};
  var options = cli.args();

  var settings = environments.loadSettings(options.environment);
  var servers = settings.servers;

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
    onBind(this.address());
  });

  return server;
}

module.exports = {
  start: start
};
