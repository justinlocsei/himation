'use strict';

var express = require('express');
var extend = require('extend');
var helmet = require('helmet');

var assets = require('./assets');
var build = require('./ui/build.json');
var pages = require('./ui/pages');
var templateEngines = require('./template-engines');
var urls = require('./urls');

// A map between asset groups and file extensions
var ASSET_GROUPS = {
  javascripts: 'js',
  stylesheets: 'css'
};

/**
 * Include information on a page's assets in the rendering context
 *
 * @param {string} page The name of the page
 * @param {string} host The URL at which the asset files are hosted
 * @param {object} context The base rendering context
 * @returns {object} A rendering context for a template
 */
function withAssets(page, host, context) {
  var media = Object.keys(ASSET_GROUPS).reduce(function(groups, group) {
    var files = assets.extract(build, page, ASSET_GROUPS[group]);
    groups[group] = files.map(function(file) {
      return urls.absolute(file, host);
    });

    return groups;
  }, {});

  return extend(media, context);
}

/**
 * Add route mappings to an application
 *
 * @param {Server} app An application instance
 * @param {Object} routes A mapping of route IDs to URLs
 * @param {string} assetUrl The URL at which assets are hosted
 * @private
 */
function route(app, routes, assetUrl) {
  app.get(routes.index, function(req, res) {
    res.render('public', withAssets('index', assetUrl, {
      content: pages.index()
    }));
  });

  app.get(routes.about, function(req, res) {
    res.render('public', withAssets('about', assetUrl, {
      content: pages.about()
    }));
  });
}

/**
 * Create an instance of an API server
 *
 * @param {Object} options Configuration for the server
 * @param {string} options.assetUrl The URL at which assets are available
 * @param {Object} options.routes A mapping of route names to URLs
 * @param {string} options.templates The path to the templates directory
 * @returns {Server} An API server that can be bound to an address
 */
function create(options) {
  var settings = options || {};

  if (!settings.assetUrl) { throw new Error('You must provide the URL for the asset server'); }
  if (!settings.routes) { throw new Error('You must specify a route resolver for the server'); }
  if (!settings.templates) { throw new Error('You must specify a path to the templates directory'); }

  var app = express();
  app.use(helmet());

  var templates = templateEngines.nunjucks(settings.templates);
  templates.express(app);

  app.set('view engine', 'html');

  route(app, settings.routes, settings.assetUrl);

  return app;
}

module.exports = {
  create: create
};
