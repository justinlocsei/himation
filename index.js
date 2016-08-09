'use strict';

if (require.main === module) {
  require('newrelic');
}

var environment = require('himation/config/environment');
var paths = require('himation/core/paths');
var Server = require('himation/server');

/**
 * Start the application server and block
 *
 * @returns {Promise} The results of starting the server
 */
function startServer() {
  var settings = environment.load(paths.resolve().settings);

  var server = new Server(settings);
  return server.start();
}

module.exports = {
  startServer: startServer
};

if (require.main === module) {
  startServer();
}
