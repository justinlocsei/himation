'use strict';

var factories = {
  buildStats: 'build-stats',
  settings: 'settings'
};

module.exports = Object.keys(factories).reduce(function(modules, name) {
  modules[name] = require('chiton-test/support/factories/' + factories[name]);
  return modules;
}, {});
