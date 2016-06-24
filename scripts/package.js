#!/usr/bin/env node

'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var jsonStableStringify = require('json-stable-stringify');
var path = require('path');

var packageDir = path.normalize(path.join(__dirname, '..'));
var shrinkwrapPath = path.join(packageDir, 'npm-shrinkwrap.json');

console.log('Updating shrinkwrap...');

childProcess.execSync('npm shrinkwrap --dev', {
  cwd: packageDir
});

console.log('Removing local dependencies...');

var shrinkwrap = JSON.parse(fs.readFileSync(shrinkwrapPath));
var dependencies = shrinkwrap.dependencies;

Object.keys(dependencies).forEach(function(dependency) {
  var details = dependencies[dependency];
  if (!details.resolved) {
    delete dependencies[dependency];
  }
});

console.log('Writing updated shrinkwrap...');

var json = jsonStableStringify(shrinkwrap, {space: 2});
fs.writeFileSync(shrinkwrapPath, json);

console.log('Package updated!');
