'use strict';

var path = require('path');

var root = path.normalize(path.join(__dirname, '..', '..'));

var build = path.join(root, 'build');
var modules = path.join(root, 'node_modules');
var src = path.join(root, 'src');

var email = path.join(src, 'email');
var server = path.join(src, 'server');
var ui = path.join(src, 'ui');

var settingsPath = process.env.HIMATION_CONFIG_FILE;
if (!settingsPath) {
  console.warn('You must provide the path to the configuration file via the HIMATION_CONFIG_FILE environment variable');
}

module.exports = {
  build: {
    assets: path.join(build, 'assets'),
    root: build
  },
  core: path.join(src, 'core'),
  email: {
    emails: path.join(email, 'emails'),
    root: email,
    templates: path.join(email, 'templates')
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
  settings: settingsPath,
  src: src,
  tasks: path.join(root, 'tasks'),
  ui: {
    images: path.join(ui, 'images'),
    inlineJs: path.join(ui, 'inline-js'),
    js: path.join(ui, 'js'),
    root: ui,
    scss: path.join(ui, 'scss'),
    scssFiles: path.join(ui, 'scss', 'himation'),
    templates: path.join(ui, 'templates')
  }
};
