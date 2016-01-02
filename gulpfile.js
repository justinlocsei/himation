'use strict';

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
var serverManager = require('chiton/server/manager');
var webpackConfigs = require('chiton/config/webpack');

var environment = process.env.CHITON_ENV;
var plugins = loadPlugins();

var settings = environments.load(environment);
var serverConfig = webpackConfigs.server(settings);
var uiConfig = webpackConfigs.ui(settings);

// Globs for matching all known assets of a type
var all = {
  js: [
    files.shallow(paths.root, 'js'),
    files.deep(paths.src, 'js'),
    files.deep(paths.test.root, 'js')
  ],
  scss: [
    files.deep(paths.ui.scss, 'scss')
  ]
};

gulp.task('build', ['bundle-assets', 'bundle-server']);
gulp.task('default', ['serve-assets']);
gulp.task('lint', ['lint-js', 'lint-scss']);
gulp.task('serve', ['serve-app', 'serve-assets']);

// Create webpack tasks for client and server builds
webpackBuildTask('bundle-assets', uiConfig);
webpackBuildTask('bundle-server', serverConfig);

// Clear the build directory
gulp.task('clear', function clear(done) {
  rimraf(paths.build.root, function(err) {
    if (err) { throw new gutil.PluginError('clear', err); }
    done();
  });
});

// Lint all JS files
gulp.task('lint-js', function lintJs() {
  return gulp.src(all.js)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// Lint all Sass files
gulp.task('lint-scss', function lintScss() {
  return gulp.src(all.scss)
    .pipe(plugins.scssLint({
      bundleExec: true
    }));
});

// Run the application server
gulp.task('serve-app', function serveApplication() {
  serverManager.start({
    environment: environment,
    onBind: function(address) {
      gutil.log('Application server available at ' + address.address + ':' + address.port);
    }
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
    if (err) { throw new gutil.PluginError('develop', err); }
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

// Verify all assets when they are changed
gulp.task('watch', function watch() {
  gulp.watch(all.js, ['lint-js']);
  gulp.watch(all.scss, ['lint-scss']);
});

/**
 * Run Mocha tests with a custom configuration
 *
 * @param {string} reporter An identifier for the Mocha reporter
 * @returns {Stream}
 */
function runTests(reporter) {
  return gulp.src(files.deep(paths.test.functional), {read: false})
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
function webpackBuildTask(task, config) {
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
