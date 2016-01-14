'use strict';

var errors = require('himation/core/errors');
var settings = require('himation/config/settings');

describe('config/settings', function() {

  describe('.build', function() {

    it('returns valid settings by default', function() {
      var options = settings.build();
      assert.isObject(options);
    });

    it('returns valid settings when given an empty customizations object', function() {
      var options = settings.build({});
      assert.isObject(options);
    });

    it('deeply merges user settings with the defaults', function() {
      var defaults = settings.build();
      var custom = settings.build({assets: {debug: true}});

      assert.isBoolean(defaults.assets.optimize);
      assert.isBoolean(custom.assets.optimize);
      assert.isTrue(custom.assets.debug);
    });

    it('does not cast boolean values', function() {
      var options = {assets: {debug: 'true'}};
      assert.throws(() => settings.build(options), errors.ConfigurationError, 'boolean');
    });

    it('does not cast numeric values', function() {
      var options = {servers: {app: {port: '80'}}};
      assert.throws(() => settings.build(options), errors.ConfigurationError, 'number');
    });

  });

});
