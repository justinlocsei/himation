'use strict';

var chai = require('chai');

var fs = require('./helpers/fs');

var assert = global.assert = chai.assert;

// Create assertions for all helpers
var helpers = [fs];
helpers.forEach(function(helper) {
  Object.keys(helper).forEach(function(helperFn) {
    assert[helperFn] = helper[helperFn];
  });
});
