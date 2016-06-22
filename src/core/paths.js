'use strict';

var path = require('path');

var errors = require('himation/core/errors');
var environment = require('himation/config/environment');

var root = path.normalize(path.join(__dirname, '..', '..'));

var build = path.join(root, 'build');
var modules = path.join(root, 'node_modules');
var src = path.join(root, 'src');
var test = path.join(root, 'test');

var server = path.join(src, 'server');
var ui = path.join(src, 'ui');

/**
 * Resolve all application paths
 *
 * @returns {object}
 * @throws {ConfigurationError} If the path to the configuration file is undefined
 */
function resolve() {
  var settingsPath = process.env.HIMATION_CONFIG_FILE;
  if (!settingsPath) {
    throw new errors.ConfigurationError('You must provide the path to the configuration file via the HIMATION_CONFIG_FILE environment variable');
  }

  var settings = environment.load(settingsPath);

  return {
    assets: settings.assets.distDir,
    build: {
      assets: path.join(build, 'assets'),
      root: build
    },
    modules: {
      bin: path.join(modules, '.bin'),
      root: modules
    },
    root: root,
    server: {
      root: server,
      views: path.join(server, 'views')
    },
    settings: process.env.HIMATION_CONFIG_FILE,
    src: src,
    test: {
      functional: path.join(test, 'functional'),
      root: test
    },
    ui: {
      js: path.join(ui, 'js'),
      root: ui,
      scss: path.join(ui, 'scss'),
      templates: path.join(ui, 'templates')
    }
  };
}

module.exports = {
  resolve: resolve
};
