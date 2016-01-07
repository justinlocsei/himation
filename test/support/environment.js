'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var fs = require('./assertions/fs');

chai.use(chaiAsPromised);

var assert = global.assert = chai.assert;

// Expose all assertions via the global assertion object
var assertionModules = [fs];
assertionModules.forEach(function(assertions) {
  Object.keys(assertions).forEach(function(assertion) {
    assert[assertion] = assertions[assertion];
  });
});
