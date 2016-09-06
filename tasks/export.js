'use strict';

var extend = require('extend');
var fs = require('fs');
var gutil = require('gulp-util');
var nunjucks = require('nunjucks');
var yargs = require('yargs');

var paths = require('himation/core/paths').resolve();
var routes = require('himation/config/routes');
var settings = require('./settings');
var urls = require('himation/core/urls');

/**
 * Export the 500 page to a file
 */
function export500Page() {
  var updated = exportTemplate('pages/500.html', getExportTarget());
  if (updated) {
    gutil.log('export-500-page', 'File updated');
  }
}

/**
 * Export the 404 page to a file
 */
function export404Page() {
  var updated = exportTemplate('pages/404.html', getExportTarget());
  if (updated) {
    gutil.log('export-404-page', 'File updated');
  }
}

/**
 * Export the sitemap to a file
 */
function exportSitemap() {
  var updated = writeSitemapToFile(getExportTarget());
  if (updated) {
    gutil.log('export-sitemap', 'Sitemap updated');
  }
}

/**
 * Get the target for an export task
 *
 * @returns {string} The target file
 * @private
 */
function getExportTarget() {
  var options = yargs
    .option('export-to', {
      alias: 'e',
      default: null,
      describe: 'The target path for an exported file'
    })
    .argv;

  return options['export-to'];
}

/**
 * Export a rendered Nunjucks template to a file
 *
 * @param {string} template The path to a Nunjucks template
 * @param {string} target The path to the target file
 * @param {object} [context] Context to pass to the template
 * @returns {boolean} Whether the file was modified or created
 * @private
 */
function exportTemplate(template, target, context) {
  var loader = new nunjucks.FileSystemLoader(paths.ui.templates);
  var renderer = new nunjucks.Environment(loader, {autoescape: true, throwOnUndefined: true});

  var oldMarkup;
  try {
    oldMarkup = fs.readFileSync(target).toString();
  } catch (e) {
    oldMarkup = '';
  }

  var newMarkup = renderer.render(template, extend({
    homePageUrl: settings.servers.app.publicUrl
  }, context || {}));

  if (oldMarkup !== newMarkup) {
    fs.writeFileSync(target, newMarkup);
    return true;
  } else {
    return false;
  }
}

/**
 * Export the sitemap to a file
 *
 * @param {string} target The path to the target file
 * @returns {boolean} Whether the sitemap was updated
 * @private
 */
function writeSitemapToFile(target) {
  var publicRoutes = routes.filter(route => route.method === 'get');
  var publicUrls = publicRoutes.map(function(route) {
    return urls.relativeToAbsolute(route.path, settings.servers.app.publicUrl);
  });

  return exportTemplate('sitemap.xml', target, {urls: publicUrls});
}

module.exports = {
  export404Page: export404Page,
  export500Page: export500Page,
  exportSitemap: exportSitemap
};
