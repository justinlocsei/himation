'use strict';

var http = require('http');

var cliArgs = require('./config/cli-args');
var paths = require('./config/paths');
var routes = require('./config/routes');
var server = require('./server/server');
var resources = require('./config/resources');
var webpackBundles = require('./config/webpack-bundles');
var webpackConfigs = require('./config/webpack-configs');

var options = cliArgs.parse();

var config = webpackConfigs.load(options.environment);
var assets = webpackBundles.urls(config);
var servers = resources.servers(options.environment);

var app = server.create({
  assets: assets,
  routes: routes,
  templates: paths.ui.templates,
  ui: paths.ui.js
});

http.createServer(app).listen(servers.api.port, servers.api.host, function() {
  var address = this.address();
  console.log('Server available at %s:%s', address.address, address.port);
});
