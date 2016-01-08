'use strict';

var names = [
  'settings'
];

module.exports = names.reduce(function(modules, name) {
  modules[name] = require('chiton-test/support/factories/' + name);
  return modules;
}, {});
