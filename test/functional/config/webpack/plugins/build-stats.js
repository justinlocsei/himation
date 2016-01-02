'use strict';

var fs = require('fs');
var path = require('path');
var tmp = require('tmp');
var webpack = require('webpack');

var BuildStatsPlugin = require('chiton/config/webpack/plugins/build-stats');

describe('config/webpack/plugins/build-stats', function() {

  describe('BuildStatsPlugin', function() {

    describe('.statsFile', function() {

      it('points to a file with the build name in the given directory', function() {
        var file = BuildStatsPlugin.statsFile('id', '/build');
        assert.equal(file, '/build/id.json');
      });

    });

    describe('#statsFile', function() {

      it('points to a JSON file in the given directory', function() {
        var plugin = new BuildStatsPlugin('id', '/build');
        assert.equal(plugin.statsFile, '/build/id.json');
      });

    });

    describe('#apply', function() {

      function configure(directory, id) {
        return {
          output: {
            path: directory,
            publicPath: '/'
          },
          plugins: [
            new BuildStatsPlugin(id, directory)
          ]
        };
      }

      it('saves the build stats to a file when the build completes', function(done) {
        var directory = tmp.dirSync().name;
        var stats = path.join(directory, 'build.json');

        assert.fileDoesNotExist(stats);

        webpack(configure(directory, 'build'), function() {
          assert.fileExists(stats);
          done();
        });
      });

      it('stores simplified build data', function(done) {
        var directory = tmp.dirSync().name;
        var stats = path.join(directory, 'build.json');

        webpack(configure(directory, 'build'), function() {
          var output = JSON.parse(fs.readFileSync(stats));

          assert.isObject(output.assets);
          assert.equal(output.root, directory);
          assert.equal(output.url, '/');

          done();
        });
      });

    });

  });

});
