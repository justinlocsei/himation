'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var assertionModules = [
  'fs'
].map(name => require('chiton-test/support/assertions/' + name));

chai.use(chaiAsPromised);

var assert = global.assert = chai.assert;

// Expose all assertions via the global assertion object
assertionModules.forEach(function(assertionFunctions) {
  Object.keys(assertionFunctions).forEach(function(assertionFunction) {
    assert[assertionFunction] = assertionFunctions[assertionFunction];
  });
});
