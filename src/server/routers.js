'use strict';

var express = require('express');

/**
 * Create a new router to handle requests
 *
 * This dynamically adds route handlers based on the provided routes data
 * structure.  The GUIDs of the routes are used to reference the entry points
 * defined in the build manifest, and these entry files are lazily loaded when
 * the route is requested.
 *
 * @param {ChitonBuildManifest} build The build manifest for the server's files
 * @param {ChitonRoute[]} routes All available routes
 * @returns {express.Router}
 */
function create(build, routes) {
  var router = express.Router(); // eslint-disable-line new-cap

  routes.forEach(function(route) {
    router[route.method](route.path, function(req, res) {
      var handler = require(build.entries[route.guid]);
      handler.renderResponse(req, res);
    });
  });

  return router;
}

module.exports = {
  create: create
};