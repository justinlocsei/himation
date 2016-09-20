'use strict';

var Server = require('himation/server');

/**
 * Start the application server and block
 *
 * @returns {Promise} The results of starting the server
 */
function startServer() {
  var server = new Server();
  return server.start();
}

module.exports = {
  startServer: startServer
};

if (require.main === module) {
  startServer();
}
