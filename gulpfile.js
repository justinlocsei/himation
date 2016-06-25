'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var WebpackProgressPlugin = require('webpack/lib/ProgressPlugin');

var environment = require('himation/config/environment');
var files = require('himation/core/files');
var paths = require('himation/core/paths').resolve();
var Server = require('himation/server');
var webpackConfigs = require('himation/config/webpack/configs');

var plugins = {
  eslint: require('gulp-eslint'),
  mocha: require('gulp-mocha'),
  stylelint: require('gulp-stylelint')
};

var settings = environment.load(paths.settings);

// Globs for matching all known files of a type
var filesByType = {
  js: [
    files.matchShallow(paths.root, 'js'),
    files.matchDeep(paths.src, 'js'),
    files.matchDeep(paths.test.root, 'js')
  ],
  scss: [
    files.matchDeep(paths.ui.scss, 'scss')
  ]
};

gulp.task('build', ['build-assets', 'build-server']);
gulp.task('default', ['serve-assets']);
gulp.task('lint', ['lint-js', 'lint-scss']);
gulp.task('serve', ['serve-app', 'serve-assets']);

// Perform a webpack build for the front-end assets
gulp.task('build-assets', function buildAssets(done) {
  runWebpackBuild(webpackConfigs.ui, done);
});

// Perform a webpack build for the server's assets
gulp.task('build-server', function buildServer(done) {
  runWebpackBuild(webpackConfigs.server, done);
});

// Clear the build directories
gulp.task('clear', function clear(done) {
  var cleared = 0;
  var buildDirs = [paths.build.root, paths.assets];

  buildDirs.forEach(function(buildDir) {
    rimraf(buildDir, function(rmrfErr) {
      if (rmrfErr) { throw new gutil.PluginError('clear', rmrfErr); }

      fs.mkdir(buildDir, function(mkdirErr) {
        if (mkdirErr) { throw new gutil.PluginError('clear', mkdirErr); }
        cleared++;

        if (cleared === buildDirs.length) {
          done();
        }
      });
    });
  });
});

// Lint all JS files
gulp.task('lint-js', function lintJs() {
  return gulp.src(filesByType.js)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// Lint all Sass files
gulp.task('lint-scss', function lintScss() {
  return gulp.src(filesByType.scss)
    .pipe(plugins.stylelint({
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

// Run the application server
gulp.task('serve-app', function serveApp() {
  var server = new Server(settings);

  server.start()
    .then(function(app) {
      var binding = app.address();
      gutil.log('Application server available at ' + binding.address + ':' + binding.port);
    })
    .catch(function(err) {
      throw new gutil.PluginError('serve-app', err);
    });

  var compiler = webpack(webpackConfigs.server(settings));
  compiler.watch({
    aggregateTimeout: 250,
    poll: false
  }, function(err) {
    if (err) {
      throw new gutil.PluginError('server-app', err);
    } else {
      gutil.log('Recompiled webpack assets');
    }
  });
});

// Run the webpack development server to serve assets
gulp.task('serve-assets', function serveAssets() {
  var config = webpackConfigs.ui(settings);

  var assetServer = new WebpackDevServer(webpack(config), {
    contentBase: paths.assets,
    publicPath: config.output.publicPath,
    stats: {
      assets: false,
      chunkModules: false,
      chunks: true,
      colors: true,
      hash: false,
      timings: false,
      version: false
    }
  });

  var binding = settings.servers.assets;
  assetServer.listen(binding.port, binding.address, function(err) {
    if (err) { throw new gutil.PluginError('serve-assets', err); }
    gutil.log('Asset server available at ' + binding.address + ':' + binding.port);
  });
});

// Run all tests
gulp.task('test', function test() {
  return gulp.src(files.matchDeep(paths.test.functional), {read: false})
    .pipe(plugins.mocha({
      reporter: 'dot',
      require: ['himation-test/support/environment']
    }));
});

/**
 * Run a webpack build for a given configuration
 *
 * @param {function} configFactory A webpack configuration factory
 * @param {function} done A function to call when the build completes
 */
function runWebpackBuild(configFactory, done) {
  var config = configFactory(settings);
  var logLabel = 'Webpack (' + config.target + ')';

  var builder = webpack(config, function(err, stats) {
    if (err) { throw new gutil.PluginError('webpack (' + config.target + ')', err); }
    gutil.log(logLabel, stats.toString({colors: true}));
    done();
  });

  builder.apply(new WebpackProgressPlugin(function(percentage, message) {
    var rounded = Math.floor(percentage * 100);
    gutil.log(logLabel, rounded + '% ' + message);
  }));
}
