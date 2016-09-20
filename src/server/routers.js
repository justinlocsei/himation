'use strict';

var express = require('express');

// A mapping between route GUIDs and loaded route handlers
var routeHandlers = {};

/**
 * Load a compiled route handler from the build manifest
 *
 * @param {HimationBuildManifest} build The build manifest for the server's files
 * @param {HimationRoute} route A single route
 * @returns {object} The route handler
 * @private
 */
function loadRouteHandler(build, route) {
  var handler = routeHandlers[route.guid];

  if (handler === undefined) {
    handler = require(build.entries[route.guid]);
    routeHandlers[route.guid] = handler;
  }

  return handler;
}

/**
 * Create a new router to handle requests
 *
 * This dynamically adds route handlers based on the provided routes data
 * structure.  The GUIDs of the routes are used to reference the entry points
 * defined in the build manifest, and these entry files are lazily loaded when
 * the route is requested.
 *
 * Since server-side router handlers require UI code that may contain libraries
 * that make assumptions about being in a browser environment, we need to mock
 * out the `window` object on the server.  We then require the compiled route JS
 * files from the build manifest, which allows the subsequent `require` calls
 * in each Express handler to avoid a costly initial load.
 *
 * @param {HimationBuildManifest} build The build manifest for the server's files
 * @param {HimationRoute[]} routes All available routes
 * @returns {express.Router}
 */
function create(build, routes) {
  var router = express.Router(); // eslint-disable-line new-cap

  global.window = global.window || {};

  routes.forEach(function(route) {
    loadRouteHandler(build, route);
  });

  routes.forEach(function(route) {
    router[route.method](route.path, function(req, res, next) {
      var handler = loadRouteHandler(build, route);
      handler.renderResponse(req, res, next);
    });
  });

  return router;
}

module.exports = {
  create: create
};
