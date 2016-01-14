'use strict';

var factories = {
  buildManifest: 'build-manifest',
  routes: 'routes',
  settings: 'settings'
};

module.exports = Object.keys(factories).reduce(function(modules, name) {
  modules[name] = require('himation-test/support/factories/' + factories[name]);
  return modules;
}, {});
