'use strict';

var environment = require('himation/config/environment');
var paths = require('himation/core/paths').resolve();
var Server = require('himation/server');

var settings = environment.load(paths.settings);

var server = new Server(settings);
server.start();
