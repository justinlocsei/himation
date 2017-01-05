'use strict';

var constants = require('himation/core/constants');
var routing = require('himation/core/routing');

module.exports = routing.defineRoutes([{
  name: 'himation',
  path: '/',
  paths: [
    {path: '#' + constants.SURVEY_ANCHOR, name: 'survey', method: 'get'},
    {path: 'about', name: 'about', method: 'get'},
    {path: 'recommendations', name: 'recommendations', method: 'post'},
    {path: 'register', name: 'registration', method: 'post'}
  ]
}]);
