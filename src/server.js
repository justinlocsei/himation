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
var settings = require('himation/core/settings');
var trackStats = require('himation/server/middleware/track-stats');

/**
 * An application server
 */
function Server() {
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
  var address = settings.servers.app;

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
    enviroment: settings.environment,
    sentryDsn: settings.errors.track && settings.errors.sentryDsn,
    templatesDirectory: paths.ui.templates
  });

  app.use(this._createLogger());
  app.use(this._createAssetMiddleware());
  app.use(trackStats.create(settings.trackStats));
  app.use(rootPath, this._createRouter());

  if (settings.errors.track) {
    app.use(this._createErrorHandler());
  }

  app.use(this._create404Handler());

  var factory = settings.servers.app.protocol === 'https' ? https : http;
  return factory.createServer(app);
};

/**
 * Create the logger for the application
 *
 * @returns {morgan} The morgan logger instance
 */
Server.prototype._createLogger = function() {
  var format = settings.server.debugLogging ? 'dev' : 'combined';
  return morgan(format);
};

/**
 * Create the middleware function for adding route assets
 *
 * @returns {function} An Express middleware function
 */
Server.prototype._createAssetMiddleware = function() {
  var uiBuild = builds.ui();
  var buildManifest = build.loadManifest(uiBuild);
  var assetHost = settings.servers.assets.publicUrl;

  return addRouteAssets.create(buildManifest, assetHost, routes);
};

/**
 * Create the router used for handling requests
 *
 * @returns {express.Router}
 */
Server.prototype._createRouter = function() {
  var serverBuild = builds.server();
  var buildManifest = build.loadManifest(serverBuild);

  return routers.create(buildManifest, routes);
};

/**
 * Create a handler that renders a 500 page for errors
 *
 * @returns {function} A request handler that renders an error page
 */
Server.prototype._createErrorHandler = function() {
  var environment = settings.environment;
  var homePageUrl = settings.servers.app.publicUrl;

  return function(err, req, res, next) { // eslint-disable-line no-unused-vars
    var raven = res.locals.raven;
    if (raven) {
      raven.captureException(err, {
        extra: {
          requestData: req.body,
          requestDataJson: JSON.stringify(req.body)
        },
        tags: {environment: environment}
      });
    }

    res.status(500);
    res.render('pages/500', {
      homePageUrl: homePageUrl
    });
  };
};

/**
 * Create a handler that renders a 404 page
 *
 * @returns {function} A handler for showing a 404 page
 */
Server.prototype._create404Handler = function() {
  var homePageUrl = settings.servers.app.publicUrl;

  return function(req, res) {
    res.status(404);
    res.render('pages/404', {
      homePageUrl: homePageUrl
    });
  };
};

module.exports = Server;
