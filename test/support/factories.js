'use strict';

var names = [];

module.exports = names.reduce(function(modules, name) {
  modules[name] = require('chiton-test/support/factories/' + name);
  return modules;
}, {});
