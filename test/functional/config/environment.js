'use strict';

var mockFs = require('mock-fs');
var sinon = require('sinon');

var environment = require('chiton/config/environment');
var errors = require('chiton/core/errors');
var settings = require('chiton/config/settings');

describe('config/environment', function() {

  var sandbox = sinon.sandbox.create();

  afterEach(function() {
    mockFs.restore();
    sandbox.restore();
  });

  describe('.load', function() {

    it('loads settings from a JSON file', function() {
      mockFs({'/settings.json': '{}'});

      var loaded = environment.load('/settings.json');
      assert.isObject(loaded);
    });

    it('merges the custom settings with the default settings', function() {
      var builder = sandbox.spy(settings, 'build');

      mockFs({
        '/settings.json': '{"assets": {"debug": true}}'
      });

      var loaded = environment.load('/settings.json');
      assert.isObject(loaded);

      assert.isTrue(builder.called);
      assert.deepEqual(builder.args[0][0], {
        assets: {
          debug: true
        }
      });
    });

    it('throws an error when the JSON file is missing', function() {
      assert.throws(() => environment.load('/settings.json'), errors.ConfigurationError, 'settings.json');
    });

    it('throws an error if the JSON file is improperly formatted', function() {
      mockFs({'/settings.json': ''});

      assert.throws(() => environment.load('/settings.json'), errors.ConfigurationError, 'parse');
    });

  });

});
