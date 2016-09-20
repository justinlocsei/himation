'use strict';

var environment = require('himation/config/environment');
var Queue = require('himation/queue/queue');

module.exports = new Queue(environment.load());
