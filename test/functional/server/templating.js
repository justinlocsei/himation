'use strict';

var templating = require('chiton/server/templating');

describe('server/templating', function() {

  describe('.nunjucks', function() {

    it('creates a new Nunjucks environment in the specified directory', function() {
      var environment = templating.nunjucks('test/path');
      var loaders = environment.loaders;

      assert.equal(loaders.length, 1);

      var paths = loaders[0].searchPaths;

      assert.equal(paths.length, 1);
      assert.equal(paths[0], 'test/path');
    });

  });

});
