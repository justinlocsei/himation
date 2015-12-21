'use strict';

var path = require('path');

var root = path.normalize(path.join(__dirname, '..'));
var ui = path.join(root, 'ui');
var build = path.join(root, 'build');
var buildAssets = path.join(build, 'assets');
var server = path.join(root, 'server');

module.exports = {
  build: {
    assets: buildAssets,
    images: path.join(buildAssets, 'images'),
    root: build
  },
  config: path.join(root, 'config'),
  root: root,
  server: {
    root: server,
    ui: path.join(server, 'ui')
  },
  ui: {
    images: path.join(ui, 'images'),
    js: path.join(ui, 'js'),
    root: ui,
    scss: path.join(ui, 'scss'),
    templates: path.join(ui, 'templates')
  }
};
