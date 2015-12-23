'use strict';

var path = require('path');

var root = path.normalize(path.join(__dirname, '..', '..'));

var build = path.join(root, 'build');
var src = path.join(root, 'src');

var ui = path.join(src, 'ui');

module.exports = {
  build: {
    root: build,
    server: path.join(build, 'server'),
    ui: path.join(build, 'ui')
  },
  config: path.join(src, 'config'),
  core: path.join(src, 'core'),
  root: root,
  server: path.join(src, 'server'),
  src: src,
  ui: {
    images: path.join(ui, 'images'),
    js: path.join(ui, 'js'),
    root: ui,
    scss: path.join(ui, 'scss'),
    templates: path.join(ui, 'templates')
  }
};
