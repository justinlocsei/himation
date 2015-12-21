'use strict';

var http = require('http');
var https = require('https');

var cliArgs = require('./config/cli-args');
var environments = require('./config/environments');
var paths = require('./config/paths');
var routes = require('./config/routes');
var server = require('./server/server');
var urls = require('./server/urls');

var options = cliArgs.parse();

var settings = environments.loadSettings(options.environment);
var servers = settings.servers;

var assetUrl = urls.expandHost(servers.assets.host, {
  port: servers.assets.port,
  protocol: servers.assets.protocol
});

var app = server.create({
  assetUrl: assetUrl,
  routes: routes,
  templates: paths.ui.templates
});

var serverFactory = servers.api.protocol === 'https' ? https : http;
serverFactory.createServer(app).listen(servers.api.port, servers.api.host, function() {
  var address = this.address();
  console.log('Server available at %s:%s', address.address, address.port);
});
