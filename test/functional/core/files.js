'use strict';

var files = require('chiton/core/files');

describe('core/files', function() {

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
