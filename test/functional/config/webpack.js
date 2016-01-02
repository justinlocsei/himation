'use strict';

var glob = require('glob');
var path = require('path');

var configs = require('chiton/config/webpack');
var makeSettings = require('chiton/config/settings').customize;
var paths = require('chiton/core/paths');

describe('config/webpack', function() {

  var settings = {
    base: makeSettings({assets: {debug: false, optimize: false}}),
    debug: makeSettings({assets: {debug: true}}),
    optimized: makeSettings({assets: {optimize: true}})
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

    describe('JS loaders', function() {

      function getLoader(config) {
        var loaders = config.module.loaders.filter(function(loader) {
          return /\.js/.test(loader.test.source);
        });

        assert.equal(loaders.length, 1);
        return loaders[0];
      }

      it('runs UI JS through the Babel loader', function() {
        var config = makeConfig(settings.base);
        var loader = getLoader(config);

        assert.equal(loader.loader, 'babel');
        loader.include.forEach(function(include) {
          assert.isChildOf(include, paths.ui.root);
        });
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

      it('exports build stats to a JSON file', function() {
        var config = makeConfig(settings.base);
        var stats = namedPlugin(config, 'BuildStatsPlugin');

        assert.isDefined(stats);
        assert.match(stats.statsFile, /\.json$/);
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

      it('does not treat a Chiton module as an external', function(done) {
        var config = configs.server(settings.base);
        checkExternal(config, 'chiton/path', function(result) {
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

  });

  describe('.ui', function() {

    baselineAssertions(configs.ui);

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

  });

});