'use strict';

var gulp = require('gulp');

var taskFiles = ['api', 'build', 'cache', 'develop', 'export', 'lint'];
var tasks = taskFiles.reduce(function(previous, name) {
  previous[name] = require('./tasks/' + name);
  return previous;
}, {});

gulp.task('test-api-response', tasks.api.testApiResponse);

gulp.task('build', ['build-assets', 'build-server']);
gulp.task('clear', tasks.build.clearBuildDirs);
gulp.task('build-assets', tasks.build.buildAssets);
gulp.task('build-server', tasks.build.buildServer);
gulp.task('serve', tasks.build.serveApp);

gulp.task('refresh-cache', tasks.cache.refreshCache);

gulp.task('develop', ['develop-app', 'develop-assets']);
gulp.task('develop-app', tasks.develop.developApp);
gulp.task('develop-assets', tasks.develop.developAssets);

gulp.task('lint', ['lint-js', 'lint-scss']);
gulp.task('lint-js', tasks.lint.lintJs);
gulp.task('lint-scss', tasks.lint.lintScss);

gulp.task('export-404-page', tasks.export.export404Page);
gulp.task('export-500-page', tasks.export.export500Page);
gulp.task('export-sitemap', tasks.export.exportSitemap);
