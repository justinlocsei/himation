'use strict';

var environment = require('himation/config/environment');
var paths = require('himation/core/paths');

module.exports = environment.load(paths.settings);
