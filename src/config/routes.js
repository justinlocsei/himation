'use strict';

var routing = require('chiton/core/routing');

module.exports = routing.defineRoutes([{
  name: 'chiton',
  path: '/',
  paths: [
    {path: 'about', name: 'about'}
  ]
}]);
