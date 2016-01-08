'use strict';

var sinon = require('sinon');

var build = require('chiton/config/webpack/build');
var errors = require('chiton/core/errors');
var BuildManifestPlugin = require('chiton/config/webpack/plugins/build-manifest');

describe('config/webpack/build', function() {

  var sandbox = sinon.sandbox.create();

  function configure() {
    return {
      context: '/context',
      entry: {
        point: './point/file'
      },
      output: {
        filename: 'file.js',
        path: '/output'
      }
    };
  }

  describe('.loadStats', function() {

    afterEach(function() {
      sandbox.restore();
    });

    it('returns an object describing the webpack build when the build-manifest plugin is used', function() {
      var plugin = new BuildManifestPlugin('build', '/output');

      var loader = sandbox.stub(plugin, 'loadStats');
      loader.returns({});

      var config = configure();
      config.plugins = [plugin];

      var manifest = build.loadStats(config);

      assert.isTrue(loader.called);
      assert.isObject(manifest);
    });

    it('throws an error if the configuration does not export build statistics', function() {
      var config = configure();
      config.plugins = [];

      assert.throws(function() { build.loadStats(config); }, errors.ConfigurationError);
    });

    it('throws an error if the build statistics cannot be loaded', function() {
      var plugin = new BuildManifestPlugin('build', '/output');

      var loader = sandbox.stub(plugin, 'loadStats');
      loader.throws();

      var config = configure();
      config.plugins = [plugin];

      assert.throws(function() { build.loadStats(config); }, errors.BuildError);
      assert.isTrue(loader.called);
    });

  });

});
