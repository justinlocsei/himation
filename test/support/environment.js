'use strict';

var chai = require('chai');

var fs = require('./assertions/fs');

var assert = global.assert = chai.assert;

// Expose all assertions via the global assertion object
var assertionModules = [fs];
assertionModules.forEach(function(assertions) {
  Object.keys(assertions).forEach(function(assertion) {
    assert[assertion] = assertions[assertion];
  });
});
