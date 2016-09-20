'use strict';

var gulp = require('gulp');
var gulpEslint = require('gulp-eslint');
var gulpStylelint = require('gulp-stylelint');

var files = require('himation/core/files');
var paths = require('himation/core/paths');

// Globs for matching all known files of a type
var filesByType = {
  js: [
    files.matchShallow(paths.root, 'js'),
    files.matchDeep(paths.src, 'js'),
    files.matchDeep(paths.tasks, 'js')
  ],
  scss: [
    files.matchDeep(paths.ui.scss, 'scss')
  ]
};

/**
 * Lint all JS files
 *
 * @returns {object} A gulp stream
 */
function lintJs() {
  return gulp.src(filesByType.js)
    .pipe(gulpEslint())
    .pipe(gulpEslint.format());
}

/**
 * Lint all SCSS files
 *
 * @returns {object} A gulp stream
 */
function lintScss() {
  return gulp.src(filesByType.scss)
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ],
      syntax: 'scss'
    }));
}

module.exports = {
  lintJs: lintJs,
  lintScss: lintScss
};
