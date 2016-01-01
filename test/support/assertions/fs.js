'use strict';

var files = require('chiton/core/files');

/**
 * Assert that a path describes a nonexistent file
 *
 * @param {string} target A path to a filesystem resource
 */
function fileDoesNotExist(target) {
  assert.isFalse(files.exists(target), target + ' does not exist');
}

/**
 * Assert that a path describes an existing filesystem resource
 *
 * @param {string} target A path to a filesystem resource
 */
function fileExists(target) {
  assert.isTrue(files.exists(target), target + ' exists');
}

/**
 * Assert that a directory contains a resource
 *
 * @param {string} target The resource that may be contained by the parent
 * @param {string} directory The possible parent directory
 */
function isChildOf(target, directory) {
  assert.isTrue(files.isChildOf(target, directory), target + ' is a child of ' + directory);
}

/**
 * Assert that a path describes a directory
 *
 * @param {string} target A path to a filesystem resource
 */
function isDirectory(target) {
  assert.isTrue(files.isDirectory(target), target + ' is a directory');
}

/**
 * Assert that a path describes a file
 *
 * @param {string} target A path to a filesystem resource
 */
function isFile(target) {
  assert.isTrue(files.isFile(target), target + ' is a file');
}

module.exports = {
  fileDoesNotExist: fileDoesNotExist,
  fileExists: fileExists,
  isChildOf: isChildOf,
  isDirectory: isDirectory,
  isFile: isFile
};
