'use strict';

var http = require('http');
var https = require('https');

var application = require('./server/application');
var cliArgs = require('./config/cli-args');
var environments = require('./config/environments');
var paths = require('./config/paths');
var routes = require('./config/routes');
var urls = require('./server/urls');

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
  var options = cliArgs.parse();

  var settings = environments.loadSettings(options.environment);
  var servers = settings.servers;

  var assetUrl = urls.expandHost(servers.assets.host, {
    port: servers.assets.port,
    protocol: servers.assets.protocol
  });

  var app = application.create({
    assetUrl: assetUrl,
    routes: routes,
    templates: paths.ui.templates
  });

  var serverFactory = servers.api.protocol === 'https' ? https : http;
  var server = serverFactory.createServer(app);

  server.listen(servers.api.port, servers.api.host, function() {
    onBind(this.address());
  });

  return server;
}

module.exports = {
  start: start
};
