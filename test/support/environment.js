'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var assertionModules = [
  require('./assertions/fs')
];

chai.use(chaiAsPromised);

var assert = global.assert = chai.assert;

// Expose all assertions via the global assertion object
assertionModules.forEach(function(assertions) {
  Object.keys(assertions).forEach(function(assertion) {
    assert[assertion] = assertions[assertion];
  });
});
