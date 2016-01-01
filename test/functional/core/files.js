'use strict';

var mockFs = require('mock-fs');

var files = require('chiton/core/files');

describe('core/files', function() {

  afterEach(function() {
    mockFs.restore();
  });

  describe('.deep', function() {

    it('returns a glob that recursively match files in a directory', function() {
      var glob = files.deep('test/path', 'js');
      assert.equal(glob, 'test/path/**/*.js');
    });

    it('matches all files when no extension is given', function() {
      var glob = files.deep('test/path');
      assert.equal(glob, 'test/path/**/*.*');
    });

  });

  describe('.exists', function() {

    beforeEach(function() {
      mockFs({'/exists': 'content'});
    });

    it('returns true when the resource exists', function() {
      assert.isTrue(files.exists('/exists'));
    });

    it('returns false when the resource does not exist', function() {
      assert.isFalse(files.exists('/does-not-exist'));
    });

  });

  describe('.isChildOf', function() {

    it('returns true when a resource is below a directory', function() {
      assert.isTrue(files.isChildOf('/one/child', '/one'));
    });

    it('returns false when a resource is above a directory', function() {
      assert.isFalse(files.isChildOf('/one', '/one/child'));
    });

    it('returns false when a resource is at the same level as a directory', function() {
      assert.isFalse(files.isChildOf('/one', '/two'));
    });

    it('returns false when the resource and directory are identical', function() {
      assert.isFalse(files.isChildOf('/one', '/one'));
    });

  });

  describe('.isDirectory', function() {

    beforeEach(function() {
      mockFs({
        '/directory': {},
        '/file': 'content'
      });
    });

    it('returns true when the resource is a directory', function() {
      assert.isTrue(files.isDirectory('/directory'));
    });

    it('returns false when the resource does not exist', function() {
      assert.isFalse(files.isDirectory('/does-not-exist'));
    });

    it('returns false when the resource is a file', function() {
      assert.isFalse(files.isDirectory('/file'));
    });

  });

  describe('.isFile', function() {

    beforeEach(function() {
      mockFs({
        '/directory': {},
        '/file': 'content'
      });
    });

    it('returns true when the resource is a file', function() {
      assert.isTrue(files.isFile('/file'));
    });

    it('returns false when the resource does not exist', function() {
      assert.isFalse(files.isFile('/does-not-exist'));
    });

    it('returns false when the resource is a directory', function() {
      assert.isFalse(files.isFile('/directory'));
    });

  });

  describe('.shallow', function() {

    it('returns a global that matches files in a directory', function() {
      var glob = files.shallow('test/path', 'js');
      assert.equal(glob, 'test/path/*.js');
    });

    it('matches all files when no extension is given', function() {
      var glob = files.shallow('test/path');
      assert.equal(glob, 'test/path/*.*');
    });

  });

});
