'use strict';

var server = require('chiton/server/manager');

server.start({
  environment: process.env.CHITON_ENV
});
