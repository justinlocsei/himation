'use strict';

var paths = require('chiton/core/paths');

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

  describe('the config directory', function() {

    it('is below the root directory', function() {
      assert.isChildOf(paths.config.root, paths.root);
    });

    it('contains a settings file', function() {
      assert.isChildOf(paths.config.settings, paths.config.root);
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
