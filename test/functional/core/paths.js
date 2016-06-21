'use strict';

var paths = require('himation/core/paths');

describe('core/paths', function() {

  describe('the root directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.root);
    });

  });

  describe('the build directory', function() {

    it('is below the root directory', function() {
      assert.isChildOf(paths.build.root, paths.root);
    });

    it('is not the source directory', function() {
      assert.notEqual(paths.build.root, paths.src);
    });

    it('contains a directory for server builds', function() {
      assert.isChildOf(paths.build.server, paths.build.root);
    });

    it('contains a directory for UI builds', function() {
      assert.isChildOf(paths.build.ui, paths.build.root);
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
      assert.isChildOf(paths.modules.root, paths.root);
    });

    it('contains a binary directory', function() {
      assert.isChildOf(paths.modules.bin, paths.modules.root);
    });

  });

  describe('the source directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.src);
    });

    it('is below the root directory', function() {
      assert.isChildOf(paths.src, paths.root);
    });

    it('contains a directory for server code', function() {
      assert.isChildOf(paths.server.root, paths.src);
      assert.isDirectory(paths.server.root);
    });

    it('contains a directory for UI code', function() {
      assert.isChildOf(paths.ui.root, paths.src);
      assert.isDirectory(paths.ui.root);
    });

    describe('the server directory', function() {

      it('contains a directory for view files', function() {
        assert.isChildOf(paths.server.views, paths.server.root);
        assert.isDirectory(paths.server.views);
      });

    });

    describe('the UI directory', function() {

      it('contains a directory for JS files', function() {
        assert.isChildOf(paths.ui.js, paths.ui.root);
        assert.isDirectory(paths.ui.js);
      });

      it('contains a directory for Sass files', function() {
        assert.isChildOf(paths.ui.scss, paths.ui.root);
        assert.isDirectory(paths.ui.scss);
      });

      it('contains a directory for templates', function() {
        assert.isChildOf(paths.ui.templates, paths.ui.root);
        assert.isDirectory(paths.ui.templates);
      });

    });

  });

  describe('the test directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.test.root);
    });

    it('is below the root directory', function() {
      assert.isChildOf(paths.test.root, paths.root);
    });

    it('contains a directory for functional tests', function() {
      assert.isChildOf(paths.test.functional, paths.test.root);
      assert.isDirectory(paths.test.functional);
    });

  });

});
