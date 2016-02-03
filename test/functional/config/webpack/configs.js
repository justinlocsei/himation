'use strict';

var clone = require('clone');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var glob = require('glob');
var path = require('path');

var factories = require('himation-test/support/factories');

var configs = require('himation/config/webpack/configs');
var paths = require('himation/core/paths');

describe('config/webpack/configs', function() {

  var settings = {
    base: factories.settings({assets: {debug: false, optimize: false}}),
    debug: factories.settings({assets: {debug: true}}),
    optimized: factories.settings({assets: {optimize: true}})
  };

  function baselineAssertions(makeConfig) {

    it('uses the debug value from the asset settings', function() {
      var withDebug = makeConfig(settings.debug);
      var withoutDebug = makeConfig(settings.base);

      assert.isTrue(withDebug.debug);
      assert.isFalse(withoutDebug.debug);
    });

    it('defines aliases to existing directories', function() {
      var config = makeConfig(settings.base);
      var aliases = Object.keys(config.resolve.alias).map(function(alias) {
        return config.resolve.alias[alias];
      });

      assert.isAbove(aliases.length, 0);
      aliases.forEach(function(alias) {
        assert.isDirectory(alias);
      });
    });

    it('adds directories containing scss files to the Sass include path', function() {
      var config = makeConfig(settings.base);
      var sassDirs = config.sassLoader.includePaths;

      assert.isAbove(sassDirs.length, 0);

      sassDirs.forEach(function(sassDir) {
        assert.isDirectory(sassDir);

        var sassFiles = glob.sync(path.join(sassDir, '**', '*.scss'));
        assert.isAbove(sassFiles.length, 0);
      });
    });

    it('uses a valid context directory', function() {
      var config = makeConfig(settings.base);
      assert.isDirectory(config.context);
    });

    it('targets a build directory for output', function() {
      var config = makeConfig(settings.base);
      assert.isChildOf(config.output.path, paths.build.root);
    });

    describe('image loaders', function() {

      function getLoader(config) {
        var loaders = config.module.loaders.filter(function(loader) {
          var test = loader.test.source;
          return test.indexOf('jpg') !== test.indexOf('png');
        });

        assert.equal(loaders.length, 1);
        return loaders[0];
      }

      function compressor(subloader) {
        return subloader.loaders.filter(function(loader) {
          return /^image-webpack\??/.test(loader);
        })[0];
      }

      it('uses a URL loader', function() {
        var config = makeConfig(settings.base);
        var loader = getLoader(config);

        var url = loader.loaders.filter(function(subloader) {
          return /^url\??/.test(subloader);
        });
        assert.equal(url.length, 1);
      });

      it('compresses images when optimizing', function() {
        var optimized = makeConfig(settings.optimized);
        var unoptimized = makeConfig(settings.base);

        var optimizedCompressor = compressor(getLoader(optimized));
        var unoptimizedCompressor = compressor(getLoader(unoptimized));

        assert.isDefined(optimizedCompressor);
        assert.isUndefined(unoptimizedCompressor);
      });

      it('creates valid JSON options for the image optimizer', function() {
        var config = makeConfig(settings.optimized);

        var json = compressor(getLoader(config)).split('?');
        var options = JSON.parse(json[1]);

        assert.isObject(options);
      });

    });

    describe('Sass loaders', function() {

      function getLoader(config) {
        var loaders = config.module.loaders.filter(function(loader) {
          return /\.scss/.test(loader.test.source);
        });

        assert.equal(loaders.length, 1);
        return loaders[0];
      }

      it('extracts text from all Sass files', function() {
        var config = makeConfig(settings.base);
        var loader = getLoader(config);

        assert.match(loader.loader, /extract-text/);
      });

      it('transforms Sass files into CSS files', function() {
        var config = makeConfig(settings.base);
        var loader = getLoader(config);

        var processors = loader.loader.split('!');
        var transformers = processors.slice(processors.indexOf('style') + 1);

        assert.match(transformers[0], /^css\??/);
        assert.match(transformers[transformers.length - 1], /^sass\??/);
      });

      it('enables source maps on all transformed Sass files', function() {
        var config = makeConfig(settings.base);
        var loader = getLoader(config);

        var processors = loader.loader.split('!');
        var transformers = processors.slice(processors.indexOf('style') + 1);

        assert.isAbove(transformers.length, 0);

        var mapped = transformers.filter(function(transformer) {
          return transformer.split('?')[1].indexOf('sourceMap') !== -1;
        });

        assert.equal(mapped.length, transformers.length);
      });

    });

    describe('plugins', function() {

      function namedPlugin(config, name) {
        return config.plugins.filter(function(plugin) {
          return plugin.constructor.name === name;
        })[0];
      }

      it('extracts text into CSS files', function() {
        var config = makeConfig(settings.base);
        var extractor = namedPlugin(config, 'ExtractTextPlugin');

        assert.isDefined(extractor);
        assert.match(extractor.filename, /\.css$/);
      });

      it('exports a build manifest to a JSON file', function() {
        var config = makeConfig(settings.base);
        var manifest = namedPlugin(config, 'BuildManifestPlugin');

        assert.isDefined(manifest);
        assert.match(manifest.manifestFile, /\.json$/);
      });

      it('aborts when the build has errors', function() {
        var config = makeConfig(settings.base);
        var aborter = namedPlugin(config, 'NoErrorsPlugin');

        assert.isDefined(aborter);
        assert.equal(config.plugins.indexOf(aborter), config.plugins.length - 1);
      });

      it('minifies all JS code when optimizing', function() {
        var optimized = makeConfig(settings.optimized);
        var unoptimized = makeConfig(settings.base);

        var optimizedCompressor = namedPlugin(optimized, 'UglifyJsPlugin');
        var unoptimizedCompressor = namedPlugin(unoptimized, 'UglifyJsPlugin');

        assert.isDefined(optimizedCompressor);
        assert.isUndefined(unoptimizedCompressor);
      });

    });

    describe('PostCSS configuration', function() {

      function plugins(config) {
        return config.postcss.map(function(plugin) {
          return plugin.postcssPlugin;
        });
      }

      it('runs autoprefixer', function() {
        var config = makeConfig(settings.base);
        assert.include(plugins(config), 'autoprefixer');
      });

      it('runs cssnano when optimizing assets', function() {
        var optimized = makeConfig(settings.optimized);
        var unoptimized = makeConfig(settings.base);

        assert.notInclude(plugins(unoptimized), 'cssnano');
        assert.include(plugins(optimized), 'cssnano');
      });

    });

  }

  describe('.server', function() {

    baselineAssertions(configs.server);

    it('defines an entry point for each view', function() {
      var config = configs.server(settings.base);
      var entries = Object.keys(config.entry);

      assert.isAbove(entries.length, 1);

      entries.forEach(function(entry) {
        var file = config.entry[entry] + '.js';
        assert.fileExists(path.join(config.context, file));
      });
    });

    it('uses a static root public path', function() {
      var config = configs.server(settings.base);
      assert.equal(config.output.publicPath, '/');
    });

    describe('externals', function() {

      function checkExternal(config, file, callback) {
        config.externals(null, file, function(err, result) {
          if (err) { throw err; }
          callback(result);
        });
      }

      it('treats a global module as an external', function(done) {
        var config = configs.server(settings.base);
        checkExternal(config, 'path', function(result) {
          assert.isTrue(result);
          done();
        });
      });

      it('does not treat a Himation module as an external', function(done) {
        var config = configs.server(settings.base);
        checkExternal(config, 'himation/path', function(result) {
          assert.isFalse(result);
          done();
        });
      });

      it('does not treat a relative module as an external', function(done) {
        var config = configs.server(settings.base);
        checkExternal(config, './relative/path', function(result) {
          assert.isFalse(result);
          done();
        });
      });

    });

    describe('JS loaders', function() {

      function getLoader(config) {
        var loaders = config.module.loaders.filter(function(loader) {
          return /\.js/.test(loader.test.source);
        });

        assert.equal(loaders.length, 1);
        return loaders[0];
      }

      it('runs server-side views and UI code through the Babel loader', function() {
        var config = configs.server(settings.base);
        var loader = getLoader(config);

        assert.equal(loader.loader, 'babel');
        assert.include(loader.include, paths.server.views);
        assert.include(loader.include, paths.ui.js);
      });

    });

  });

  describe('.ui', function() {

    baselineAssertions(configs.ui);

    it('defines an entry point for each page component', function() {
      var config = configs.ui(settings.base);
      var entries = Object.keys(config.entry);

      assert.isAbove(entries.length, 1);

      entries.forEach(function(entry) {
        var file = config.entry[entry] + '.js';
        assert.fileExists(path.join(config.context, file));
      });
    });

    it('defines commons chunks for all shared pages', function() {
      var config = configs.ui(settings.base);
      var commons = config.plugins.filter(function(plugin) {
        return plugin.constructor === CommonsChunkPlugin;
      });

      assert.isAbove(commons.length, 0);

      commons.forEach(function(plugin) {
        assert.isAbove(plugin.selectedChunks.length, 1);
        plugin.selectedChunks.forEach(function(chunk) {
          assert.property(config.entry, chunk);
        });
      });
    });

    it('lints all UI JS before processing', function() {
      var config = configs.ui(settings.base);
      var linters = config.module.preLoaders.filter(function(loader) {
        return /\.js/.test(loader.test.source);
      });

      assert.equal(linters.length, 1);

      var linter = linters[0];
      assert.equal(linter.loader, 'eslint');
      linter.include.forEach(function(include) {
        assert.isChildOf(include, paths.ui.root);
      });
    });

    it('defaults to the root path for its public path', function() {
      var config = configs.ui(settings.base);
      assert.equal(config.output.publicPath, '/');
    });

    it('uses a custom path for the asset server as its public path', function() {
      var options = clone(settings.base);
      options.servers.assets.path = '/custom/path';

      var config = configs.ui(options);
      assert.equal(config.output.publicPath, '/custom/path');
    });

    describe('JS loaders', function() {

      function getLoader(config) {
        var loaders = config.module.loaders.filter(function(loader) {
          return /\.js/.test(loader.test.source);
        });

        assert.equal(loaders.length, 1);
        return loaders[0];
      }

      it('runs UI JS through the Babel loader', function() {
        var config = configs.ui(settings.base);
        var loader = getLoader(config);

        assert.equal(loader.loader, 'babel');
        loader.include.forEach(function(include) {
          assert.isChildOf(include, paths.ui.root);
        });
      });

    });

  });

});
