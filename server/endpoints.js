'use strict';

/**
 * Map routes to actions for an application
 *
 * @param {Server} app An application instance
 * @param {Object} routes A mapping of route IDs to URLs
 */
function map(app, routes) {

  app.get(routes.index, function(req, res) {
    res.render('index.html');
  });

  app.get(routes.about, function(req, res) {
    res.render('about.html');
  });

}

module.exports = {
  map: map
};
