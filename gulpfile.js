'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var loadPlugins = require('gulp-load-plugins');
var rimraf = require('rimraf');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var WebpackProgressPlugin = require('webpack/lib/ProgressPlugin');

var cliArgs = require('./config/cli-args');
var environments = require('./config/environments');
var files = require('./config/files');
var paths = require('./config/paths');
var webpackConfigs = require('./config/webpack-configs');

var options = cliArgs.parse();
var plugins = loadPlugins();

var settings = environments.loadSettings(options.environment);
var serverConfig = webpackConfigs.server(settings);
var uiConfig = webpackConfigs.ui(settings);

// Globs for matching all known assets of a type
var all = {
  js: [
    files.shallow(paths.root, 'js'),
    files.deep(paths.ui.js, 'js'),
    files.deep(paths.config, 'js'),
    files.deep(paths.server, 'js')
  ],
  scss: [
    files.deep(paths.ui.scss, 'scss')
  ]
};

gulp.task('build', ['bundle-assets', 'bundle-server']);
gulp.task('default', ['develop']);
gulp.task('develop', ['watch', 'serve']);
gulp.task('lint', ['lint-js', 'lint-scss']);

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

// Run the webpack development server
gulp.task('serve', function serve() {
  var server = new WebpackDevServer(webpack(uiConfig), {
    contentBase: paths.build.root,
    publicPath: uiConfig.output.publicPath,
    stats: {colors: true}
  });

  var binding = settings.servers.assets;
  server.listen(binding.port, binding.host, function(err) {
    if (err) { throw new gutil.PluginError('develop', err); }
  });
});

// Verify all assets when they are changed
gulp.task('watch', function watch() {
  gulp.watch(all.js, ['lint-js']);
  gulp.watch(all.scss, ['lint-scss']);
});

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
