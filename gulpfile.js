'use strict';

var extend = require('extend');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var nunjucks = require('nunjucks');
var Promise = require('bluebird');
var request = require('request');
var rimraf = require('rimraf');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var WebpackProgressPlugin = require('webpack/lib/ProgressPlugin');
var yargs = require('yargs');

var api = require('himation/server/api');
var environment = require('himation/config/environment');
var files = require('himation/core/files');
var paths = require('himation/core/paths').resolve();
var routes = require('himation/config/routes');
var Server = require('himation/server');
var startServer = require('./index').startServer;
var surveyData = require('himation/server/data/survey');
var urls = require('himation/core/urls');
var webpackConfigs = require('himation/config/webpack/configs');

var options = yargs
  .option('export-to', {
    alias: 'e',
    default: null,
    describe: 'The target path for an exported file'
  })
  .option('optimize', {
    alias: 'o',
    default: false,
    describe: 'Optimize all build artifacts'
  })
  .option('survey', {
    alias: 's',
    default: null,
    describe: 'The path to a survey dump file'
  })
  .argv;

var plugins = {
  eslint: require('gulp-eslint'),
  mocha: require('gulp-mocha'),
  stylelint: require('gulp-stylelint')
};

// If explicit optimization has been requested, override the config values that
// control asset builds
var settings = environment.load(paths.settings);
if (options.optimize) {
  settings.assets.debug = false;
  settings.assets.optimize = true;
}

// Globs for matching all known files of a type
var filesByType = {
  js: [
    files.matchShallow(paths.root, 'js'),
    files.matchDeep(paths.src, 'js'),
    files.matchDeep(paths.test.root, 'js')
  ],
  scss: [
    files.matchDeep(paths.ui.scss, 'scss')
  ]
};

gulp.task('build', ['build-assets', 'build-server']);
gulp.task('develop', ['develop-app', 'develop-assets']);
gulp.task('lint', ['lint-js', 'lint-scss']);

// Serve the app
gulp.task('serve', function serve() {
  startServer()
    .then(function() { gutil.log('Application server started'); })
    .catch(function(err) { throw new gutil.PluginError('serve', err); });
});

// Perform a webpack build for the front-end assets
gulp.task('build-assets', function buildAssets(done) {
  runWebpackBuild(webpackConfigs.ui, done);
});

// Perform a webpack build for the server's assets
gulp.task('build-server', function buildServer(done) {
  runWebpackBuild(webpackConfigs.server, done);
});

// Clear the build directories
gulp.task('clear', function clear(done) {
  var cleared = 0;
  var buildDirs = [paths.build.root, settings.assets.distDir];

  buildDirs.forEach(function(buildDir) {
    rimraf(buildDir, function(rmrfErr) {
      if (rmrfErr) { throw new gutil.PluginError('clear', rmrfErr); }

      fs.mkdir(buildDir, function(mkdirErr) {
        if (mkdirErr) { throw new gutil.PluginError('clear', mkdirErr); }
        cleared++;

        if (cleared === buildDirs.length) {
          done();
        }
      });
    });
  });
});

// Lint all JS files
gulp.task('lint-js', function lintJs() {
  return gulp.src(filesByType.js)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// Lint all Sass files
gulp.task('lint-scss', function lintScss() {
  return gulp.src(filesByType.scss)
    .pipe(plugins.stylelint({
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ],
      syntax: 'scss'
    }));
});

// Run the application server in development mode
gulp.task('develop-app', function developApp() {
  var server = new Server(settings);

  server.start()
    .then(function(app) {
      var binding = app.address();
      gutil.log('Application server available at ' + binding.address + ':' + binding.port);
    })
    .catch(function(err) {
      throw new gutil.PluginError('develop-app', err);
    });

  var compiler = webpack(webpackConfigs.server(settings));
  compiler.watch({
    aggregateTimeout: 250,
    poll: false
  }, function(err) {
    if (err) {
      throw new gutil.PluginError('develop-app', err);
    } else {
      gutil.log('Recompiled webpack assets');
    }
  });
});

// Run the webpack development server to serve assets
gulp.task('develop-assets', function developAssets() {
  var config = webpackConfigs.ui(settings);

  var assetServer = new WebpackDevServer(webpack(config), {
    contentBase: settings.assets.distDir,
    publicPath: config.output.publicPath,
    stats: {
      assets: false,
      chunkModules: false,
      chunks: true,
      colors: true,
      hash: false,
      timings: false,
      version: false
    }
  });

  var binding = settings.servers.assets;
  assetServer.listen(binding.port, binding.address, function(err) {
    if (err) { throw new gutil.PluginError('develop-assets', err); }
    gutil.log('Asset server available at ' + binding.address + ':' + binding.port);
  });
});

// Run all tests
gulp.task('test', function test() {
  return gulp.src(files.matchDeep(paths.test.functional), {read: false})
    .pipe(plugins.mocha({
      reporter: 'dot',
      require: ['himation-test/support/environment']
    }));
});

// Refresh the gateway cache
gulp.task('refresh-cache', function refreshCache(done) {
  var requestAsync = Promise.promisify(request);
  var logLabel = 'refresh-cache';

  var gateway = settings.caching.gatewayUrl;
  var appUrl = settings.servers.app.publicUrl;
  var caCertificate = fs.readFileSync(settings.servers.app.caCertificatePath);

  var banRoutes = routes.filter(route => route.method === 'get');
  var primeRoutes = banRoutes.reduce(function(previous, route) {
    var url = urls.relativeToAbsolute(route.path, appUrl);
    previous.push({url: url, gzip: true, path: route.path});
    previous.push({url: url, gzip: false, path: route.path});
    return previous;
  }, []);

  Promise.map(banRoutes, function(route) {
    gutil.log(logLabel, 'Banning ' + route.path);
    return requestAsync({
      url: gateway,
      method: 'BAN',
      headers: {'X-Ban': route.path}
    });
  }).catch(function(error) {
    throw new gutil.PluginError(logLabel, 'Could not ban URLs: ' + error);
  }).then(function() {
    gutil.log(logLabel, 'Banned all URLs');
    return Promise.map(primeRoutes, function(route) {
      gutil.log(logLabel, 'Priming ' + route.path + ' (gzip ' + route.gzip + ')');
      return requestAsync({
        url: route.url,
        gzip: route.gzip,
        agentOptions: {
          ca: caCertificate
        }
      });
    });
  }).catch(function(error) {
    throw new gutil.PluginError(logLabel, 'Could not prime URLs: ' + error);
  }).then(function() {
    gutil.log(logLabel, 'Primed all URLs');
    done();
  });
});

// View the contents of an API response from a data dump
//
// This loads a survey-request data dump, which is a JSON file containing the
// POST data sent to the survey.  This data is used to generate an API request
// and display its contents.
gulp.task('test-api-response', function testApiResponse(done) {
  var rawPostData;
  var logLabel = 'test-api-response';

  try {
    rawPostData = fs.readFileSync(options.survey);
  } catch (e) {
    throw new gutil.PluginError(logLabel, 'You must provide the path to a survey-data file via --survey');
  }

  var postData = surveyData.convertPostDataToProfile(JSON.parse(rawPostData));
  var apiClient = api.createApiClient(settings.chiton.endpoint, settings.chiton.token);
  var apiData = api.packageSurvey(postData);

  gutil.log(logLabel, 'Sending API request');
  gutil.log(logLabel, JSON.stringify(apiData, null, 2));

  apiClient.requestRecommendations(apiData)
    .catch(function(error) {
      throw new gutil.PluginError(logLabel, error);
    })
    .then(function(response) {
      gutil.log(logLabel, 'Received API response');
      gutil.log(logLabel, JSON.stringify(response, null, 2));
      done();
    });
});

// Export the 500 page to a file
gulp.task('export-500-page', function export500Page() {
  var updated = exportTemplate('pages/500.html', options['export-to']);
  if (updated) {
    gutil.log('export-500-page', 'File updated');
  }
});

// Export the 404 page to a file
gulp.task('export-404-page', function export404Page() {
  var updated = exportTemplate('pages/404.html', options['export-to']);
  if (updated) {
    gutil.log('export-404-page', 'File updated');
  }
});

// Export the sitemap to a file
gulp.task('export-sitemap', function exportSitemap() {
  var updated = writeSitemapToFile(options['export-to']);
  if (updated) {
    gutil.log('export-sitemap', 'Sitemap updated');
  }
});

/**
 * Run a webpack build for a given configuration
 *
 * @param {function} configFactory A webpack configuration factory
 * @param {function} done A function to call when the build completes
 */
function runWebpackBuild(configFactory, done) {
  var config = configFactory(settings);
  var logLabel = 'Webpack (' + config.target + ')';

  var builder = webpack(config, function(err, stats) {
    if (err) { throw new gutil.PluginError('webpack (' + config.target + ')', err); }
    gutil.log(logLabel, stats.toString({colors: true}));
    done();
  });

  if (settings.assets.debug) {
    builder.apply(new WebpackProgressPlugin(function(percentage, message) {
      var rounded = Math.floor(percentage * 100);
      gutil.log(logLabel, rounded + '% ' + message);
    }));
  }
}

/**
 * Export a rendered Nunjucks template to a file
 *
 * @param {string} template The path to a Nunjucks template
 * @param {string} target The path to the target file
 * @param {object} [target] Context to pass to the template
 * @returns {boolean} Whether the file was modified or created
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
 */
function writeSitemapToFile(target) {
  var publicRoutes = routes.filter(route => route.method === 'get');
  var publicUrls = publicRoutes.map(function(route) {
    return urls.relativeToAbsolute(route.path, settings.servers.app.publicUrl);
  });

  return exportTemplate('sitemap.xml', target, {urls: publicUrls});
}
