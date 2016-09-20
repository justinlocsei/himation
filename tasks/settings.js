'use strict';

var yargs = require('yargs');

var settings = require('himation/core/settings');

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
