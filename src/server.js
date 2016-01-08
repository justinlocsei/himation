'use strict';

var http = require('http');
var https = require('https');
var Promise = require('bluebird');

var addRouteAssets = require('chiton/server/middleware/add-route-assets');
var application = require('chiton/server/application');
var build = require('chiton/config/webpack/build');
var builds = require('chiton/config/webpack/configs');
var paths = require('chiton/core/paths');
var routes = require('chiton/config/routes');
var urls = require('chiton/core/urls');

/**
 * An application server
 *
 * @param {ChitonSettings} settings Environment settings for the server
 */
function Server(settings) {
  this.settings = settings;

  this._app = null;
  this._isBound = false;
}

/**
 * Start the server
 *
 * @returns {Promise} A promise that will be fulfilled when the server is ready
 * @fulfill {net.Server} The running application server
 * @reject {Error} If the server could not be bound
 */
Server.prototype.start = function() {
  var that = this;
  var app = this._getApplication();

  if (this._isBound) {
    return Promise.resolve(app);
  }

  var address = this.settings.servers.app;

  return new Promise(function(resolve, reject) {
    app.on('error', function(err) {
      app.removeAllListeners();
      that._isBound = false;
      reject(err);
    });

    app.on('listening', function() {
      app.removeAllListeners();
      that._isBound = true;
      resolve(app);
    });

    app.listen(address.port, address.host);
  });
};

/**
 * Stop the server
 *
 * @returns {Promise} A promise that will be fulfilled when the server has stopped
 * @fulfill {net.Server} The stopped application server
 * @reject {Error} If the server could not be stopped
 */
Server.prototype.stop = function() {
  var that = this;
  var app = this._getApplication();

  if (!this._isBound) {
    return Promise.resolve(app);
  }

  return new Promise(function(resolve, reject) {
    app.close(function(err) {
      that._isBound = false;
      app.removeAllListeners();

      if (err) {
        reject(err);
      } else {
        resolve(app);
      }
    });
  });
};

/**
 * Get an instance of the application
 *
 * If the application has not yet been created, this will create it.  Otherwise,
 * it will return the existing copy.
 *
 * @returns {net.Server}
 */
Server.prototype._getApplication = function() {
  if (this._app) {
    return this._app;
  }

  var app = application.create({
    templatesDirectory: paths.ui.templates
  });

  app.use(this._createAssetMiddleware());

  var factory = this.settings.servers.app.protocol === 'https' ? https : http;
  this._app = factory.createServer(app);

  return this._app;
};

/**
 * Create the middleware function for adding route assets
 *
 * @returns {function} An Express middleware function
 */
Server.prototype._createAssetMiddleware = function() {
  var uiBuild = builds.ui(this.settings);
  var buildStats = build.loadStats(uiBuild);

  var uiServer = this.settings.servers.assets;
  var assetHost = urls.expandHostname(uiServer.host, {
    port: uiServer.port,
    protocol: uiServer.protocol
  });

  return addRouteAssets.create(buildStats, assetHost, routes);
};

module.exports = Server;
