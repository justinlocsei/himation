'use strict';

var express = require('express');
var extend = require('extend');
var http = require('http');
var https = require('https');
var nunjucks = require('nunjucks');
var Promise = require('bluebird');

var api = require('himation/server/api');
var emails = require('himation/email/emails');
var paths = require('himation/core/paths').resolve();

/**
 * Configure the app's template engine
 *
 * @param {express.Application} app An application instance
 * @param {string} directory The path to the template directory
 * @private
 */
function configureAppTemplates(app, directory) {
  var loader = new nunjucks.FileSystemLoader(directory);

  var env = new nunjucks.Environment(loader, {
    autoescape: true,
    throwOnUndefined: true
  });

  env.express(app);

  app.set('view engine', 'html');
}

/**
 * Configure the preview routes for the server
 *
 * @param {express.Request} req An Express request
 * @param {express.Response} res An Express response
 * @param {ApiClient} apiClient An API client
 * @private
 */
function showPreview(req, res, apiClient) {
  var slug = req.query.email;

  var context = {
    currentEmail: slug,
    emails: emails.getAll()
  };

  if (slug) {
    var email = emails.findBySlug(req.query.email);

    email.batchRender(apiClient, {
      rangeStart: 1,
      rangeEnd: 2,
      onRender: function(rendered) {
        res.render('preview', extend({
          email: rendered
        }, context));
      }
    });
  } else {
    res.render('preview', context);
  }
}

/**
 * Create a new preview server for emails
 *
 * @param {HimationSettings} settings Environment settings for the server
 */
function PreviewServer(settings) {
  this.settings = settings;

  this._app = null;
  this._isBound = false;
}

/**
 * Start the server
 *
 * @returns {Promise} The result of starting the server
 * @fulfill {new.Server} The running server
 * @reject {Error} If the server could not be started
 */
PreviewServer.prototype.start = function() {
  var that = this;
  var address = this.settings.servers.app;

  var app = this._app;
  if (!app) {
    app = this._createApplication();
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
 * @returns {Promise} The result of stopping the server
 * @fulfill {net.Server} The stopped application server
 * @reject {Error} If the server could not be stopped
 */
PreviewServer.prototype.stop = function() {
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
 * @returns {net.Server}
 */
PreviewServer.prototype._createApplication = function() {
  var app = express();

  configureAppTemplates(app, paths.email.templates);

  var apiClient = api.createApiClient(this.settings.chiton.endpoint, this.settings.chiton.token);

  app.get('/', function(req, res) {
    return showPreview(req, res, apiClient);
  });

  var factory = this.settings.servers.app.protocol === 'https' ? https : http;
  return factory.createServer(app);
};

module.exports = PreviewServer;
