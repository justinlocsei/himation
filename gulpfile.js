'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var loadPlugins = require('gulp-load-plugins');
var rimraf = require('rimraf');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var WebpackProgressPlugin = require('webpack/lib/ProgressPlugin');

var environments = require('chiton/config/environments');
var files = require('chiton/core/files');
var paths = require('chiton/core/paths');
var Server = require('chiton/server');
var webpackConfigs = require('chiton/config/webpack/configs');

var environment = process.env.CHITON_ENV;
var plugins = loadPlugins();

var settings = environments.load(environment);
var serverConfig = webpackConfigs.server(settings);
var uiConfig = webpackConfigs.ui(settings);

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

// Create webpack tasks for client and server builds
createWebpackTask('build-assets', uiConfig);
createWebpackTask('build-server', serverConfig);

// Clear the build directory
gulp.task('clear', function clear(done) {
  rimraf(paths.build.root, function(rmrfErr) {
    if (rmrfErr) { throw new gutil.PluginError('clear', rmrfErr); }

    fs.mkdir(paths.build.root, function(mkdirErr) {
      if (mkdirErr) { throw new gutil.PluginError('clear', mkdirErr); }
      done();
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
    .pipe(plugins.scssLint({
      bundleExec: true
    }));
});

// Run the application server
gulp.task('serve-app', function serveApplication() {
  var server = new Server(settings);

  server.start()
    .then(function(app) {
      var binding = app.address();
      gutil.log('Application server available at ' + binding.address + ':' + binding.port);
    })
    .catch(function(err) {
      throw new gutil.PluginError('serve-app', err);
    });
});

// Run the webpack development server to serve assets
gulp.task('serve-assets', function serveAssets() {
  var assetServer = new WebpackDevServer(webpack(uiConfig), {
    contentBase: paths.build.root,
    publicPath: uiConfig.output.publicPath,
    stats: {colors: true}
  });

  var binding = settings.servers.assets;
  assetServer.listen(binding.port, binding.host, function(err) {
    if (err) { throw new gutil.PluginError('serve-assets', err); }
    gutil.log('Asset server available at ' + binding.host + ':' + binding.port);
  });
});

// Run all tests with terse output
gulp.task('test-terse', function testTerse() {
  return runTests('dot');
});

// Run all tests with verbose output
gulp.task('test-verbose', function testVerbose() {
  return runTests('spec');
});

// Verify all verifiable source code in reaction to a change
gulp.task('watch', function watch() {
  gulp.watch(filesByType.js, ['lint-js']);
  gulp.watch(filesByType.scss, ['lint-scss']);
});

/**
 * Run Mocha tests with a custom configuration
 *
 * @param {string} reporter An identifier for the Mocha reporter
 * @returns {Stream}
 */
function runTests(reporter) {
  return gulp.src(files.matchDeep(paths.test.functional), {read: false})
    .pipe(plugins.mocha({
      reporter: reporter,
      require: ['chiton-test/support/environment'],
      ui: 'bdd'
    }));
}

/**
 * Create a gulp task for building a webpack bundle
 *
 * @param {string} task The name of the gulp task
 * @param {object} config A webpack configuration
 */
function createWebpackTask(task, config) {
  gulp.task(task, function(done) {
    var logLabel = 'Webpack (' + config.target + ')';

    var builder = webpack(config, function(err, stats) {
      if (err) { throw new gutil.PluginError(task, err); }
      gutil.log(logLabel, stats.toString({colors: true}));
      done();
    });

    builder.apply(new WebpackProgressPlugin(function(percentage, message) {
      var rounded = Math.floor(percentage * 100);
      gutil.log(logLabel, rounded + '% ' + message);
    }));
  });
}
