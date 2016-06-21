'use strict';

var paths = require('himation/core/paths');
var environment = require('himation/config/environment');
var Server = require('himation/server');

var settings = environment.load(paths.settings);

var server = new Server(settings);
server.start();
