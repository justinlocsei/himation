'use strict';

var routing = require('himation/core/routing');

module.exports = routing.defineRoutes([{
  name: 'himation',
  path: '/',
  paths: [
    {path: 'about', name: 'about'}
  ]
}]);
