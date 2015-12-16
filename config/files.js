'use strict';

var path = require('path');

/**
 * Return a glob that recursively matches all files in a directory
 *
 * @param {string} directory The directory containing files
 * @param {string} [extension] The extension of the files to find
 * @returns {string} The file-matching glob
 */
function deep(directory, extension) {
  return path.join(directory, '**', '*.' + (extension || '*'));
}

/**
 * Return a glob that matches all files in a directory
 *
 * @param {string} directory The directory containing files
 * @param {string} [extension] The extension of the files to find
 * @returns {string} The file-matching glob
 */
function shallow(directory, extension) {
  return path.join(directory, '*.' + (extension || '*'));
}

module.exports = {
  deep: deep,
  shallow: shallow
};
