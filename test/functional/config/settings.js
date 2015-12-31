'use strict';

var settings = require('chiton/config/settings');

describe('settings', function() {

  describe('.customize', function() {

    it('returns a settings object by default', function() {
      var options = settings.customize();
      assert.isObject(options);
      assert.isObject(options.webpack);
    });

    it('combines a user-provided object with the defaults', function() {
      var options = settings.customize({custom: true});
      assert.isTrue(options.custom);
    });

    it('deeply merges the user settings', function() {
      var options = settings.customize({
        webpack: {
          custom: true
        }
      });
      assert.isBoolean(options.webpack.debug);
      assert.isTrue(options.webpack.custom);
    });

  });

});
