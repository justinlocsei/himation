'use strict';

var _ = require('lodash');
var express = require('express');
var extend = require('extend');
var helmet = require('helmet');

var build = require('./build');
var templateEngines = require('./template-engines');
var urls = require('./urls');

var pages = build.bridge('pages');
var uiBuild = build.stats('ui');

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
 * @private
 */
function withAssets(page, host, context) {
  var media = _.zipObject(Object.keys(ASSET_GROUPS).map(function(group) {
    var files = build.assets(uiBuild, page, ASSET_GROUPS[group]);
    var hrefs = files.map(function(file) { return urls.absolute(file, host); });
    return [group, hrefs];
  }));

  return extend(media, context);
}

/**
 * Add route mappings to an application
 *
 * @param {Server} app An application instance
 * @param {object} routes A mapping of route IDs to URLs
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
 * @param {object} options Configuration for the server
 * @param {string} options.assetUrl The URL at which assets are available
 * @param {object} options.routes A mapping of route names to URLs
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
