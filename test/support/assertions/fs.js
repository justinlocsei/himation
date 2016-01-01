'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Determine whether a path describes an existing resource
 *
 * @param {string} fsPath A path to a filesystem resource
 * @returns {boolean}
 * @private
 */
function exists(fsPath) {
  try {
    fs.statSync(fsPath);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Assert that a directory contains a directory or file
 *
 * @param {string} child The resource that may be contained by the parent
 * @param {string} parent The possible parent directory
 */
function childDirectory(child, parent) {
  var relative = path.relative(parent, child);
  assert.notEqual(relative.indexOf('.'), 0);
}

/**
 * Assert that a path describes a directory
 *
 * @param {string} fsPath A path to a filesystem resource
 */
function isDirectory(fsPath) {
  var valid = false;

  if (exists(fsPath)) {
    var stats = fs.statSync(fsPath);
    valid = stats.isDirectory();
  }

  assert.isTrue(valid);
}

/**
 * Assert that a path describes a file
 *
 * @param {string} fsPath A path to a filesystem resource
 */
function isFile(fsPath) {
  var valid = false;

  if (exists(fsPath)) {
    var stats = fs.statSync(fsPath);
    valid = stats.isFile();
  }

  assert.isTrue(valid);
}

/**
 * Assert that a path describes an existing file or directory
 *
 * @param {string} fsPath A path to a file or directory
 */
function pathExists(fsPath) {
  assert.isTrue(exists(fsPath));
}

module.exports = {
  childDirectory: childDirectory,
  isDirectory: isDirectory,
  isFile: isFile,
  pathExists: pathExists
};
