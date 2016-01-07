'use strict';

var environments = require('chiton/config/environments');
var errors = require('chiton/core/errors');

describe('config/environments', function() {

  describe('.load', function() {

    it('defines default settings', function() {
      var settings = environments.load();
      assert.isObject(settings);
    });

    it('loads settings for a known environment', function() {
      var settings = environments.load('development');
      assert.isObject(settings);
    });

    it('loads different settings for each environment', function() {
      var development = environments.load('development');
      var production = environments.load('production');
      assert.notEqual(development.assets.debug, production.assets.debug);
    });

    it('throws an error when an unknown environment is provided', function() {
      assert.throws(function() { environments.load('invalid'); }, errors.ConfigurationError);
    });

  });

});
