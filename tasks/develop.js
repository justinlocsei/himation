'use strict';

var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var settings = require('./settings');
var Server = require('himation/server');
var webpackConfigs = require('himation/config/webpack/configs');

/**
 * Run the application server in development mode
 */
function developApp() {
  var server = new Server(settings);

  server.start()
    .then(function(app) {
      var binding = app.address();
      gutil.log('Application server available at ' + binding.address + ':' + binding.port);
    })
    .catch(function(err) {
      throw new gutil.PluginError('develop-app', err);
    });

  var compiler = webpack(webpackConfigs.server(settings));
  compiler.watch({
    aggregateTimeout: 250,
    poll: false
  }, function(err) {
    if (err) {
      throw new gutil.PluginError('develop-app', err);
    } else {
      gutil.log('Recompiled webpack assets');
    }
  });
}

/**
 * Run the asset server in development mode
 */
function developAssets() {
  var config = webpackConfigs.ui(settings);

  var assetServer = new WebpackDevServer(webpack(config), {
    contentBase: settings.assets.distDir,
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
    if (err) { throw new gutil.PluginError('develop-assets', err); }
    gutil.log('Asset server available at ' + binding.address + ':' + binding.port);
  });
}

module.exports = {
  developApp: developApp,
  developAssets: developAssets
};
