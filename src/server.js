'use strict';

var http = require('http');
var https = require('https');
var morgan = require('morgan');
var Promise = require('bluebird');

var addRouteAssets = require('himation/server/middleware/add-route-assets');
var application = require('himation/server/application');
var build = require('himation/config/webpack/build');
var builds = require('himation/config/webpack/configs');
var paths = require('himation/core/paths');
var routers = require('himation/server/routers');
var routes = require('himation/config/routes');

/**
 * An application server
 *
 * @param {HimationSettings} settings Environment settings for the server
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
  var address = this.settings.servers.app;

  var app = this._app;
  if (!app) {
    app = this._createApplication(address.path);
    this._app = app;
  }

  if (this._isBound) {
    return Promise.resolve(app);
  }

  return new Promise(function(resolve, reject) {
    function handleError(err) {
      that._isBound = false;
      reject(err);
    }

    function handleListening() {
      that._isBound = true;
      resolve(app);
    }

    app.on('close', function() {
      app.removeListener('error', handleError);
      app.removeListener('listening', handleListening);
    });

    app.on('error', handleError);
    app.on('listening', handleListening);

    app.listen(address.port, address.address);
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
  var app = this._app;

  if (!this._isBound || !app) {
    return Promise.resolve(app);
  }

  return new Promise(function(resolve, reject) {
    app.close(function(err) {
      that._isBound = false;

      if (err) {
        reject(err);
      } else {
        resolve(app);
      }
    });
  });
};

/**
 * Create an instance of the application
 *
 * @param {string} rootPath The root path for the server
 * @returns {net.Server}
 */
Server.prototype._createApplication = function(rootPath) {
  var app = application.create({
    templatesDirectory: paths.resolve().ui.templates
  });

  app.use(this._createLogger());
  app.use(this._createAssetMiddleware());
  app.use(rootPath, this._createRouter());

  var factory = this.settings.servers.app.protocol === 'https' ? https : http;
  return factory.createServer(app);
};

/**
 * Create the logger for the application
 *
 * @returns {morgan} The morgan logger instance
 */
Server.prototype._createLogger = function() {
  var format = this.settings.server.debugLogging ? 'dev' : 'combined';
  return morgan(format);
};

/**
 * Create the middleware function for adding route assets
 *
 * @returns {function} An Express middleware function
 */
Server.prototype._createAssetMiddleware = function() {
  var uiBuild = builds.ui(this.settings);
  var buildManifest = build.loadManifest(uiBuild);
  var assetHost = this.settings.servers.assets.publicUrl;

  return addRouteAssets.create(buildManifest, assetHost, routes);
};

/**
 * Create the router used for handling requests
 *
 * @returns {express.Router}
 */
Server.prototype._createRouter = function() {
  var serverBuild = builds.server(this.settings);
  var buildManifest = build.loadManifest(serverBuild);

  return routers.create(buildManifest, routes, this.settings);
};

module.exports = Server;
