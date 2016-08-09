#!/usr/bin/env node

'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var jsonStableStringify = require('json-stable-stringify');
var path = require('path');

var PACKAGE_DIR = path.normalize(path.join(__dirname, '..'));
var SHRINKWRAP_PATH = path.join(PACKAGE_DIR, 'npm-shrinkwrap.json');

console.log('Updating shrinkwrap...');
var oldDeps = parseShrinkwrap();
childProcess.execSync('npm shrinkwrap --dev', {cwd: PACKAGE_DIR});
var newDeps = parseShrinkwrap();
var dependencies = newDeps.dependencies;

console.log('Removing local links...');
ignoreLinkedPackages(dependencies);

console.log('Removing extraneous fields...');
removeExtraneousFields(dependencies, oldDeps.dependencies);

console.log('Writing updated shrinkwrap...');
var json = jsonStableStringify(newDeps, {space: 2});
fs.writeFileSync(SHRINKWRAP_PATH, json);

console.log('Package updated!');

/**
 * Get an in-memory representation of the shrinkwrap file
 *
 * @returns {object} The shrinkwrap data
 */
function parseShrinkwrap() {
  if (fs.statSync(SHRINKWRAP_PATH).isFile()) {
    return JSON.parse(fs.readFileSync(SHRINKWRAP_PATH));
  } else {
    return {
      dependencies: {}
    };
  }
}

/**
 * Remove all links from the top-level dependencies
 *
 * Links show up in the manifest as lacking a resolution, so we use an empty
 * `resolved` field as the hint that the package is a link.
 *
 * @param {object} dependencies The package dependencies
 */
function ignoreLinkedPackages(dependencies) {
  Object.keys(dependencies).forEach(function(dependency) {
    var details = dependencies[dependency];
    if (!details.resolved) {
      delete dependencies[dependency];
    }
  });
}

/**
 * Remove all extraneous fields from each dependency in the tree
 *
 * This removes the `resolved` and `from` fields for all non-git dependencies,
 * and ensures that git dependencies remain unmodified.
 *
 * @param {object} newDeps The current package dependencies
 * @param {object} oldDeps The previous package dependencies
 */
function removeExtraneousFields(newDeps, oldDeps) {
  Object.keys(newDeps).forEach(function(depName) {
    var newDep = newDeps[depName];
    var oldDep = oldDeps[depName];

    if (newDep.resolved && newDep.resolved.indexOf('git:') === -1) {
      delete newDep.resolved;
      delete newDep.from;
    } else if (oldDep) {
      newDep.resolved = oldDep.resolved;
      newDep.from = oldDep.from;
    }

    if (newDep.dependencies) {
      removeExtraneousFields(newDep.dependencies, oldDep ? oldDep.dependencies || {} : {});
    }
  });
}
