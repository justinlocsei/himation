'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var loadPlugins = require('gulp-load-plugins');
var rimraf = require('rimraf');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var cliArgs = require('./config/cli-args');
var environments = require('./config/environments');
var files = require('./config/files');
var paths = require('./config/paths');
var webpackConfigs = require('./config/webpack-configs');

var options = cliArgs.parse();
var plugins = loadPlugins();

var settings = environments.loadSettings(options.environment);
var webpackConfig = webpackConfigs.load(settings);

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

gulp.task('build', ['bundle-assets']);
gulp.task('default', ['develop']);
gulp.task('develop', ['watch', 'serve']);
gulp.task('lint', ['lint-js', 'lint-scss']);

// Bundle all assets using webpack
gulp.task('bundle-assets', function bundleAssets(done) {
  webpack(webpackConfig, function(err, stats) {
    if (err) { throw new gutil.PluginError('build', err); }
    gutil.log('build', stats.toString({colors: true}));
    done();
  });
});

// Clear the build directory
gulp.task('clear', function clear(done) {
  rimraf(paths.build.base, function(err) {
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
  var servers = settings.servers(options.environment);

  var server = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: paths.build.base,
    publicPath: webpackConfig.output.publicPath,
    stats: {colors: true}
  });

  server.listen(servers.assets.port, servers.assets.host, function(err) {
    if (err) { throw new gutil.PluginError('develop', err); }
  });
});

// Verify all assets when they are changed
gulp.task('watch', function watch() {
  gulp.watch(all.js, ['lint-js']);
  gulp.watch(all.scss, ['lint-scss']);
});
