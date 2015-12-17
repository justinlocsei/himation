'use strict';

var path = require('path');

/**
 * Create a new loader for React components
 *
 * @param {string} path The path to the components directory
 */
function Loader(path) {
  this.path = path;

  this._jsxEnabled = false;
}

/**
 * Load a named react component
 *
 * @param {string} name The name of a React component's file
 * @returns {Object} The react compoment
 * @throws If the component cannot be found
 */
Loader.prototype.load = function(name) {
  if (!this._jsxEnabled) {
    this._enableJsx();
  }

  return require(path.join(this.path, name + '.jsx'));
};

/**
 * Allow JSX files to be required
 */
Loader.prototype._enableJsx = function() {
  var register = require('babel-register');
  require('babel-polyfill');

  register({
    extensions: ['.jsx'],
    only: new RegExp(this.path),
    presets: ['react']
  });
};

module.exports = {
  Loader: Loader
};
