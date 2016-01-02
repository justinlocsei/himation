'use strict';

var mockFs = require('mock-fs');
var sinon = require('sinon');

var build = require('chiton/config/webpack/build');
var BuildStatsPlugin = require('chiton/config/webpack/plugins/build-stats');

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

  describe('.entry', function() {

    it('generates the absolute path to the compiled file', function() {
      var config = configure();

      var target = build.entry(config, 'point');
      assert.equal(target, '/output/file.js');
    });

    it('handles name-based output targets', function() {
      var config = configure();
      config.output.filename = '[name].js';

      var target = build.entry(config, 'point');
      assert.equal(target, '/output/point.js');
    });

    it('throws an error if the source file is not an entry point', function() {
      var config = configure();

      assert.throws(function() { build.entry(config, 'invalid'); }, build.ConfigurationError);
    });

    it('throws an error if the target file relies on compile-time information', function() {
      var config = configure();
      config.output.filename = '[name]-[id].js';

      assert.throws(function() { build.entry(config, 'point'); }, build.ConfigurationError);
    });

  });

  describe('.stats', function() {

    afterEach(function() {
      sandbox.restore();
    });

    it('returns an object describing the webpack build when the build-stats plugin is used', function() {
      var plugin = new BuildStatsPlugin('build', '/output');

      var loader = sandbox.stub(plugin, 'loadStats');
      loader.returns({});

      var config = configure();
      config.plugins = [plugin];

      var stats = build.stats(config);

      assert.isTrue(loader.called);
      assert.isObject(stats);
    });

    it('throws an error if the configuration does not export build statistics', function() {
      var config = configure();
      config.plugins = [];

      assert.throws(function() { build.stats(config); }, build.ConfigurationError);
    });

    it('throws an error if the build statistics cannot be loaded', function() {
      var plugin = new BuildStatsPlugin('build', '/output');

      var loader = sandbox.stub(plugin, 'loadStats');
      loader.throws();

      var config = configure();
      config.plugins = [plugin];

      assert.throws(function() { build.stats(config); }, build.StatsError);
      assert.isTrue(loader.called);
    });

  });

});
