'use strict';

var path = require('path');

var errors = require('himation/core/errors');

var root = path.normalize(path.join(__dirname, '..', '..'));

var build = path.join(root, 'build');
var modules = path.join(root, 'node_modules');
var src = path.join(root, 'src');

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

  return {
    build: {
      assets: path.join(build, 'assets'),
      root: build
    },
    core: path.join(src, 'core'),
    modules: {
      bin: path.join(modules, '.bin'),
      root: modules
    },
    root: root,
    server: {
      root: server,
      views: path.join(server, 'views')
    },
    settings: settingsPath,
    src: src,
    tasks: path.join(root, 'tasks'),
    ui: {
      images: path.join(ui, 'images'),
      js: path.join(ui, 'js'),
      root: ui,
      scss: path.join(ui, 'scss'),
      scssFiles: path.join(ui, 'scss', 'himation'),
      templates: path.join(ui, 'templates')
    }
  };
}

module.exports = {
  resolve: resolve
};
