'use strict';

var routing = require('himation/core/routing');

module.exports = routing.defineRoutes([{
  name: 'himation',
  path: '/',
  paths: [
    {path: 'recommendations', name: 'recommendations', method: 'post'},
    {path: 'register', name: 'registration', method: 'post'}
  ]
}]);
