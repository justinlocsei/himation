'use strict';

var yargs = require('yargs');

var environment = require('himation/config/environment');
var paths = require('himation/core/paths');

var settings = environment.load(paths.resolve().settings);

var options = yargs
  .option('optimize', {
    alias: 'o',
    default: false,
    describe: 'Optimize all build artifacts'
  })
  .argv;

if (options.optimize) {
  settings.assets.debug = false;
  settings.assets.optimize = true;
}

module.exports = settings;
