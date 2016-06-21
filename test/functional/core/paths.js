'use strict';

var errors = require('himation/core/errors');
var paths = require('himation/core/paths');

describe('core/paths', function() {

  describe('the root directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.resolve().root);
    });

  });

  describe('the build directory', function() {

    it('is below the root directory', function() {
      assert.isChildOf(paths.resolve().build.root, paths.resolve().root);
    });

    it('is not the source directory', function() {
      assert.notEqual(paths.resolve().build.root, paths.resolve().src);
    });

    it('contains a directory for server builds', function() {
      assert.isChildOf(paths.resolve().build.server, paths.resolve().build.root);
    });

    it('contains a directory for UI builds', function() {
      assert.isChildOf(paths.resolve().build.ui, paths.resolve().build.root);
    });

  });

  describe('the config file', function() {

    var previousConfig;

    beforeEach(function() {
      previousConfig = process.env.HIMATION_CONFIG_FILE;
    });

    afterEach(function() {
      process.env.HIMATION_CONFIG_FILE = previousConfig;
    });

    it('is set from an environment variable', function() {
      process.env.HIMATION_CONFIG_FILE = '/tmp/config.json';
      assert.equal(paths.resolve().settings, '/tmp/config.json');
    });

    it('causes path resolution to fail if the environment variable is unset', function() {
      delete process.env.HIMATION_CONFIG_FILE;
      assert.throws(() => paths.resolve(), errors.ConfigurationError);
    });

    it('causes path resolution to fail if the environment variable is blank', function() {
      process.env.HIMATION_CONFIG_FILE = '';
      assert.throws(() => paths.resolve(), errors.ConfigurationError);
    });

  });

  describe('the module directories', function() {

    it('is below the root directory', function() {
      assert.isChildOf(paths.resolve().modules.root, paths.resolve().root);
    });

    it('contains a binary directory', function() {
      assert.isChildOf(paths.resolve().modules.bin, paths.resolve().modules.root);
    });

  });

  describe('the source directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.resolve().src);
    });

    it('is below the root directory', function() {
      assert.isChildOf(paths.resolve().src, paths.resolve().root);
    });

    it('contains a directory for server code', function() {
      assert.isChildOf(paths.resolve().server.root, paths.resolve().src);
      assert.isDirectory(paths.resolve().server.root);
    });

    it('contains a directory for UI code', function() {
      assert.isChildOf(paths.resolve().ui.root, paths.resolve().src);
      assert.isDirectory(paths.resolve().ui.root);
    });

    describe('the server directory', function() {

      it('contains a directory for view files', function() {
        assert.isChildOf(paths.resolve().server.views, paths.resolve().server.root);
        assert.isDirectory(paths.resolve().server.views);
      });

    });

    describe('the UI directory', function() {

      it('contains a directory for JS files', function() {
        assert.isChildOf(paths.resolve().ui.js, paths.resolve().ui.root);
        assert.isDirectory(paths.resolve().ui.js);
      });

      it('contains a directory for Sass files', function() {
        assert.isChildOf(paths.resolve().ui.scss, paths.resolve().ui.root);
        assert.isDirectory(paths.resolve().ui.scss);
      });

      it('contains a directory for templates', function() {
        assert.isChildOf(paths.resolve().ui.templates, paths.resolve().ui.root);
        assert.isDirectory(paths.resolve().ui.templates);
      });

    });

  });

  describe('the test directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.resolve().test.root);
    });

    it('is below the root directory', function() {
      assert.isChildOf(paths.resolve().test.root, paths.resolve().root);
    });

    it('contains a directory for functional tests', function() {
      assert.isChildOf(paths.resolve().test.functional, paths.resolve().test.root);
      assert.isDirectory(paths.resolve().test.functional);
    });

  });

});
