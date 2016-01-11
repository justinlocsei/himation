'use strict';

var path = require('path');

var root = path.normalize(path.join(__dirname, '..', '..'));

var build = path.join(root, 'build');
var modules = path.join(root, 'node_modules');
var src = path.join(root, 'src');
var test = path.join(root, 'test');

var server = path.join(src, 'server');
var ui = path.join(src, 'ui');

module.exports = {
  build: {
    root: build,
    server: path.join(build, 'server'),
    ui: path.join(build, 'ui')
  },
  docs: path.join(root, 'docs'),
  modules: {
    bin: path.join(modules, '.bin'),
    root: modules
  },
  root: root,
  server: {
    root: server,
    views: path.join(server, 'views')
  },
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
