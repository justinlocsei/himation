'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var Promise = require('bluebird');
var request = require('request');

var routes = require('himation/config/routes');
var settings = require('./settings');
var urls = require('himation/core/urls');

/**
 * Refresh the gateway cache
 *
 * This sends BAN requests to the gateway cache specified in the settings, after
 * which it requests all GET routes that lack parameters.
 *
 * @param {function} done A completion callback
 */
function refreshCache(done) {
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
}

module.exports = {
  refreshCache: refreshCache
};
