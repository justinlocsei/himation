'use strict';

var path = require('path');

/**
 * Create a new loader for UI code
 *
 * @param {string} directory The path to the UI JS directory
 */
function Loader(directory) {
  this.directory = directory;

  this._canTranspile = false;
}

/**
 * Require a JS file from the UI directory
 *
 * @param {string} file The path to the file, relative to the UI directory
 * @returns {Object} The required file
 * @throws If the file cannot be required
 */
Loader.prototype.require = function(file) {
  if (!this._canTranspile) {
    this._enableTranspiling();
  }

  return require(path.join(this.directory, file));
};

/**
 * Allow ES6 JSX UI code to be required and transpiled by Babel
 */
Loader.prototype._enableTranspiling = function() {
  require('babel-polyfill');

  var register = require('babel-register');

  register({
    extensions: ['.js'],
    only: new RegExp(this.directory),
    presets: ['es2015', 'react']
  });
};

module.exports = {
  Loader: Loader
};
