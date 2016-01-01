'use strict';

var fs = require('fs');
var path = require('path');
var tmp = require('tmp');
var webpack = require('webpack');

var BuildStatsPlugin = require('chiton/config/webpack-plugins/build-stats');

describe('config/webpack-plugins/build-stats', function() {

  describe('BuildStatsPlugin', function() {

    describe('#statsFile', function() {

      it('points to a JSON file in the given directory', function() {
        var plugin = new BuildStatsPlugin('id', '/build');
        assert.equal(plugin.statsFile, '/build/id.json');
      });

    });

    describe('#apply', function() {

      function config(directory, id) {
        return {
          output: {path: directory},
          plugins: [new BuildStatsPlugin(id, directory)]
        };
      }

      it('saves the build stats to a file when the build completes', function(done) {
        var directory = tmp.dirSync().name;
        var stats = path.join(directory, 'build.json');

        assert.fileDoesNotExist(stats);

        webpack(config(directory, 'build'), function() {
          assert.fileExists(stats);
          done();
        });
      });

      it('saves minimal information on the build', function(done) {
        var directory = tmp.dirSync().name;
        var stats = path.join(directory, 'build.json');

        webpack(config(directory, 'build'), function() {
          var output = JSON.parse(fs.readFileSync(stats));

          assert.isUndefined(output.modules);
          assert.isUndefined(output.reasons);
          assert.isUndefined(output.timings);
          assert.isUndefined(output.version);

          done();
        });
      });

    });

  });

});
