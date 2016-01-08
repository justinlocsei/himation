'use strict';

var environments = require('chiton/config/environments');
var Server = require('chiton/server');

var settings = environments.load(process.env.CHITON_ENV);

var server = new Server(settings);
server.start();
