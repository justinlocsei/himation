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

  describe('.loadManifest', function() {

    afterEach(function() {
      sandbox.restore();
    });

    it('returns an object describing the webpack build when the build-manifest plugin is used', function() {
      var plugin = new BuildManifestPlugin('build', '/output');

      var loader = sandbox.stub(plugin, 'loadManifest');
      loader.returns({});

      var config = configure();
      config.plugins = [plugin];

      var manifest = build.loadManifest(config);

      assert.isTrue(loader.called);
      assert.isObject(manifest);
    });

    it('throws an error if the configuration does not export a build manifest', function() {
      var config = configure();
      config.plugins = [];

      assert.throws(function() { build.loadManifest(config); }, errors.ConfigurationError);
    });

    it('throws an error if the build manifest cannot be loaded', function() {
      var plugin = new BuildManifestPlugin('build', '/output');

      var loader = sandbox.stub(plugin, 'loadManifest');
      loader.throws();

      var config = configure();
      config.plugins = [plugin];

      assert.throws(function() { build.loadManifest(config); }, errors.BuildError);
      assert.isTrue(loader.called);
    });

  });

});
