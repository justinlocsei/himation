'use strict';

var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var fs = require('fs');
var path = require('path');
var tmp = require('tmp');
var webpack = require('webpack');

var BuildManifestPlugin = require('chiton/config/webpack/plugins/build-manifest');

describe('config/webpack/plugins/build-manifest', function() {

  describe('BuildManifestPlugin', function() {

    describe('.manifestFile', function() {

      it('points to a file with the build name in the given directory', function() {
        var file = BuildManifestPlugin.manifestFile('id', '/build');
        assert.equal(file, '/build/id.json');
      });

    });

    describe('#manifestFile', function() {

      it('points to a JSON file in the given directory', function() {
        var plugin = new BuildManifestPlugin('id', '/build');
        assert.equal(plugin.manifestFile, '/build/id.json');
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
            new BuildManifestPlugin(id, directory)
          ]
        };
      }

      it('saves the build manifest to a file when the build completes', function(done) {
        var directory = tmp.dirSync().name;
        var manifest = path.join(directory, 'build.json');

        assert.fileDoesNotExist(manifest);

        webpack(configure(directory, 'build'), function() {
          assert.fileExists(manifest);
          done();
        });
      });

      it('stores simplified build data', function(done) {
        var directory = tmp.dirSync().name;
        var manifest = path.join(directory, 'build.json');

        webpack(configure(directory, 'build'), function() {
          var output = JSON.parse(fs.readFileSync(manifest));

          assert.isObject(output.assets);
          assert.isObject(output.entries);
          assert.isString(output.root);
          assert.isString(output.path);

          done();
        });
      });

      describe('the build data', function() {

        function configureBuild(directory, id, filename, plugins) {
          var source = tmp.dirSync().name;
          fs.writeFileSync(path.join(source, 'shared.js'), '"use strict"');
          fs.writeFileSync(path.join(source, 'one.js'), 'require("./shared")');
          fs.writeFileSync(path.join(source, 'two.js'), 'require("./shared")');
          fs.writeFileSync(path.join(source, 'three.js'), 'require("./shared")');

          return {
            context: source,
            entry: {
              'test.one': './one.js',
              'test.two': './two.js',
              'test.three': './three.js'
            },
            output: {
              filename: filename,
              path: directory,
              publicPath: '/assets/'
            },
            plugins: (plugins || []).concat([
              new BuildManifestPlugin(id, directory)
            ])
          };
        }

        function checkOutput(directory, filename, callback, plugins) {
          var manifest = path.join(directory, 'build.json');

          webpack(configureBuild(directory, 'build', filename, plugins), function() {
            var output = JSON.parse(fs.readFileSync(manifest));
            callback(output);
          });
        }

        it('contains the URL to access the build files', function(done) {
          var directory = tmp.dirSync().name;

          checkOutput(directory, '[name].js', function(output) {
            assert.equal(output.path, '/assets/');
            done();
          });
        });

        it('contains the directory path to the build files', function(done) {
          var directory = tmp.dirSync().name;

          checkOutput(directory, '[name].js', function(output) {
            assert.equal(output.root, directory);
            done();
          });
        });

        it('contains a list of assets associated with each chunk', function(done) {
          var directory = tmp.dirSync().name;

          checkOutput(directory, '[name].js', function(output) {
            assert.deepEqual(output.assets['test.one'], ['test.one.js']);
            assert.deepEqual(output.assets['test.two'], ['test.two.js']);
            done();
          });
        });

        it('contains a map between entry-point source and compiled files', function(done) {
          var directory = tmp.dirSync().name;

          checkOutput(directory, '[name].js', function(output) {
            assert.equal(output.entries['test.one'], path.join(directory, 'test.one.js'));
            assert.equal(output.entries['test.two'], path.join(directory, 'test.two.js'));
            done();
          });
        });

        it('adds files from the commons chunk to each file list', function(done) {
          var directory = tmp.dirSync().name;
          var plugins = [new CommonsChunkPlugin({name: 'commons', filename: 'commons.js'})];

          checkOutput(directory, '[name].js', function(output) {
            assert.deepEqual(output.assets['test.one'], ['commons.js', 'test.one.js']);
            assert.deepEqual(output.assets['test.two'], ['commons.js', 'test.two.js']);
            done();
          }, plugins);
        });

        it('omits commons-chunk files from excluded entry points', function(done) {
          var directory = tmp.dirSync().name;
          var plugins = [
            new CommonsChunkPlugin({
              name: 'commons',
              filename: 'commons.js',
              chunks: ['test.one', 'test.three']
            })
          ];

          checkOutput(directory, '[name].js', function(output) {
            assert.deepEqual(output.assets['test.one'], ['commons.js', 'test.one.js']);
            assert.deepEqual(output.assets['test.two'], ['test.two.js']);
            done();
          }, plugins);
        });

        describe('entry-point filename placeholders', function() {

          function checkFilename(template, callback) {
            var directory = tmp.dirSync().name;
            checkOutput(directory, template, callback);
          }

          it('resolves [name]', function(done) {
            checkFilename('[name].js', function(output) {
              assert.match(output.entries['test.one'], /\/test\.one\.js$/);
              assert.fileExists(output.entries['test.one']);

              done();
            });
          });

          it('resolves [hash]', function(done) {
            checkFilename('[hash].js', function(output) {
              assert.notMatch(output.entries['test.one'], /test\.one\.js$/);
              assert.match(output.entries['test.one'], /\/[a-z0-9]{16,}\.js$/);
              assert.fileExists(output.entries['test.one']);

              done();
            });
          });

          it('resolves [chunkhash]', function(done) {
            checkFilename('[chunkhash].js', function(output) {
              assert.notMatch(output.entries['test.one'], /test\.one\.js$/);
              assert.match(output.entries['test.one'], /\/[a-z0-9]{16,}\.js$/);
              assert.fileExists(output.entries['test.one']);

              done();
            });
          });

          it('correctly resolves multiple placeholders', function(done) {
            checkFilename('[name]-[chunkhash].js', function(output) {
              assert.match(output.entries['test.one'], /\/test\.one-[a-z0-9]{16,}\.js$/);
              assert.fileExists(output.entries['test.one']);

              done();
            });
          });

        });

      });

    });

    describe('#loadManifest', function() {

      function configure(directory, id, plugins) {
        return {
          output: {
            path: directory,
            publicPath: '/'
          },
          plugins: plugins
        };
      }

      it('loads the manifest file', function(done) {
        var directory = tmp.dirSync().name;
        var plugin = new BuildManifestPlugin('build', directory);
        var config = configure(directory, 'build', [plugin]);

        webpack(config, function() {
          var output = plugin.loadManifest();
          assert.equal(output.root, directory);

          done();
        });
      });

      it('throws an error when the manifest file does not exist', function() {
        var directory = tmp.dirSync().name;
        var plugin = new BuildManifestPlugin('build', directory);

        assert.throws(function() { plugin.loadManifest(); }, 'ENOENT');
      });

    });

  });

});
