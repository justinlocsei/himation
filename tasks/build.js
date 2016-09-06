'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var webpack = require('webpack');

var paths = require('himation/core/paths');
var settings = require('./settings');
var startServer = require('../index').startServer;
var webpackConfigs = require('himation/config/webpack/configs');
var WebpackProgressPlugin = require('webpack/lib/ProgressPlugin');

/**
 * Serve the app
 */
function serveApp() {
  startServer()
    .then(function() { gutil.log('Application server started'); })
    .catch(function(err) { throw new gutil.PluginError('serve', err); });
}

/**
 * Run a Webpack build for the front-end assets
 *
 * @param {function} done A completion callback
 */
function buildAssets(done) {
  runWebpackBuild(webpackConfigs.ui, done);
}

/**
 * Run a Webpack build for the server files
 *
 * @param {function} done A completion callback
 */
function buildServer(done) {
  runWebpackBuild(webpackConfigs.server, done);
}

/**
 * Clear all build directories
 *
 * @param {function} done A completion callback
 */
function clearBuildDirs(done) {
  var cleared = 0;
  var buildDirs = [paths.resolve().build.root, settings.assets.distDir];

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
}

/**
 * Run a webpack build for a given configuration
 *
 * @param {function} configFactory A webpack configuration factory
 * @param {function} done A function to call when the build completes
 * @private
 */
function runWebpackBuild(configFactory, done) {
  var config = configFactory(settings);
  var logLabel = 'Webpack (' + config.target + ')';

  var builder = webpack(config, function(err, stats) {
    if (err) { throw new gutil.PluginError('webpack (' + config.target + ')', err); }
    gutil.log(logLabel, stats.toString({colors: true}));
    done();
  });

  if (settings.assets.debug) {
    builder.apply(new WebpackProgressPlugin(function(percentage, message) {
      var rounded = Math.floor(percentage * 100);
      gutil.log(logLabel, rounded + '% ' + message);
    }));
  }
}

module.exports = {
  buildAssets: buildAssets,
  buildServer: buildServer,
  clearBuildDirs: clearBuildDirs,
  serveApp: serveApp
};
