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
      assert.childDirectory(paths.build.root, paths.root);
    });

    it('is not the source directory', function() {
      assert.notEqual(paths.build.root, paths.src);
    });

    it('contains a directory for server builds', function() {
      assert.childDirectory(paths.build.server, paths.build.root);
    });

    it('contains a directory for UI builds', function() {
      assert.childDirectory(paths.build.ui, paths.build.root);
    });

  });

  describe('the source directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.src);
    });

    it('is below the root directory', function() {
      assert.childDirectory(paths.src, paths.root);
    });

    it('contains a directory for server code', function() {
      assert.childDirectory(paths.server, paths.src);
      assert.isDirectory(paths.server);
    });

    it('contains a directory for UI code', function() {
      assert.childDirectory(paths.ui.root, paths.src);
      assert.isDirectory(paths.ui.root);
    });

    describe('the UI directory', function() {

      it('contains a directory for JS files', function() {
        assert.childDirectory(paths.ui.js, paths.ui.root);
        assert.isDirectory(paths.ui.js);
      });

      it('contains a directory for Sass files', function() {
        assert.childDirectory(paths.ui.scss, paths.ui.root);
        assert.isDirectory(paths.ui.scss);
      });

      it('contains a directory for templates', function() {
        assert.childDirectory(paths.ui.templates, paths.ui.root);
        assert.isDirectory(paths.ui.templates);
      });

    });

  });

  describe('the test directory', function() {

    it('exists', function() {
      assert.isDirectory(paths.test.root);
    });

    it('is below the root directory', function() {
      assert.childDirectory(paths.test.root, paths.root);
    });

    it('contains a directory for functional tests', function() {
      assert.childDirectory(paths.test.functional, paths.test.root);
      assert.isDirectory(paths.test.functional);
    });

  });

});
