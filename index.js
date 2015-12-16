'use strict';

var cliArgs = require('./config/cli-args');
var routes = require('./config/routes');
var server = require('./lib/server');
var resources = require('./config/resources');

var options = cliArgs.parse();
var servers = resources.servers(options.environment);

server.serve({
  host: servers.api.host,
  port: servers.api.port,
  routes: routes
});
