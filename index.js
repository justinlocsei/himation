'use strict';

var paths = require('chiton/core/paths');
var environment = require('chiton/config/environment');
var Server = require('chiton/server');

var settings = environment.load(paths.config.settings);

var server = new Server(settings);
server.start();
