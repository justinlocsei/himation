'use strict';

var http = require('http');

var cliArgs = require('./config/cli-args');
var paths = require('./config/paths');
var routes = require('./config/routes');
var server = require('./server/server');
var resources = require('./config/resources');

var options = cliArgs.parse();
var servers = resources.servers(options.environment);

var app = server.create({
  routes: routes,
  templates: paths.ui.templates
});

http.createServer(app).listen(servers.api.port, servers.api.host);
