'use strict';

var path = require('path');

var root = path.normalize(path.join(__dirname, '..'));
var app = path.join(root, 'app');
var build = path.join(root, 'build');
var buildAssets = path.join(build, 'assets');

module.exports = {
  app: {
    base: app,
    images: path.join(app, 'images'),
    js: path.join(app, 'js'),
    scss: path.join(app, 'scss'),
    templates: path.join(app, 'templates')
  },
  build: {
    assets: buildAssets,
    base: build,
    images: path.join(buildAssets, 'images')
  },
  config: path.join(root, 'config'),
  lib: path.join(root, 'lib'),
  root: root
};
