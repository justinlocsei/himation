'use strict';

var path = require('path');

var root = path.normalize(path.join(__dirname, '..'));

var build = path.join(root, 'build');
var ui = path.join(root, 'ui');

module.exports = {
  build: {
    root: build,
    server: path.join(build, 'server'),
    ui: path.join(build, 'ui')
  },
  config: path.join(root, 'config'),
  root: root,
  server: path.join(root, 'server'),
  ui: {
    images: path.join(ui, 'images'),
    js: path.join(ui, 'js'),
    root: ui,
    scss: path.join(ui, 'scss'),
    templates: path.join(ui, 'templates')
  }
};
