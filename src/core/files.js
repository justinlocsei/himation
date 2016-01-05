'use strict';

var fs = require('fs');
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
 * Determine whether the target path exists
 *
 * @param {string} target A path to a filesystem resource
 * @returns {boolean}
 */
function exists(target) {
  try {
    fs.statSync(target);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Determine whether one resource is a child of a directory
 *
 * @param {string} resource A path to a file or directory
 * @param {string} directory A path to the possible parent directory
 * @returns {boolean}
 */
function isChildOf(resource, directory) {
  var relative = path.relative(directory, resource);
  return relative !== '' && !/^\.{2}/.test(relative);
}

/**
 * Determine whether a path describes an extant directory
 *
 * @param {string} target A path to a filesystem resource
 * @returns {boolean}
 */
function isDirectory(target) {
  if (exists(target)) {
    return fs.statSync(target).isDirectory();
  } else {
    return false;
  }
}

/**
 * Determine whether a path describes an extant directory
 *
 * @param {string} target A path to a filesystem resource
 * @returns {boolean}
 */
function isFile(target) {
  if (exists(target)) {
    return fs.statSync(target).isFile();
  } else {
    return false;
  }
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
  exists: exists,
  isChildOf: isChildOf,
  isDirectory: isDirectory,
  isFile: isFile,
  shallow: shallow
};
