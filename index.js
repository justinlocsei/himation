'use strict';

var http = require('http');

var cliArgs = require('./config/cli-args');
var environments = require('./config/environments');
var paths = require('./config/paths');
var routes = require('./config/routes');
var server = require('./server/server');
var webpackBundles = require('./config/webpack-bundles');
var webpackConfigs = require('./config/webpack-configs');

var options = cliArgs.parse();

var settings = environments.loadSettings(options.environment);
var config = webpackConfigs.load(settings);
var assets = webpackBundles.urls(config);

var app = server.create({
  assets: assets,
  routes: routes,
  templates: paths.ui.templates,
  ui: paths.ui.js
});

http.createServer(app).listen(settings.servers.api.port, settings.servers.api.host, function() {
  var address = this.address();
  console.log('Server available at %s:%s', address.address, address.port);
});
