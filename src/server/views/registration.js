'use strict';

var api = require('himation/server/api');
var queue = require('himation/queue');
var routes = require('himation/config/routes');
var routing = require('himation/core/routing');
var settings = require('himation/core/settings');

module.exports = function renderResponse(req, res) {
  var apiClient = api.createApiClient();
  var homePage = routing.guidToRoute(routes, 'himation.index');
  var wantsJson = req.accepts(['html', 'json']) === 'json';

  var data = {
    email: req.body.email,
    recommendationId: parseInt(req.body.recommendationId, 10)
  };

  var registerUser = apiClient.registerUser(data);

  registerUser
    .then(function() {
      return queue.addTask('send-welcome-email', data.email);
    })
    .then(function() {
      var wardrobeProfileId = registerUser.value();

      res.cookie(settings.cookies.registered, '1', {
        httpOnly: true,
        maxAge: 90000,
        secure: true
      });

      if (wantsJson) {
        return res.json({
          error: false,
          wardrobeProfileId: wardrobeProfileId
        });
      } else {
        return res.redirect(homePage.path);
      }
    })
    .catch(function(error) {
      if (wantsJson) {
        res.json({error: true});
      } else {
        res.redirect(homePage.path);
      }

      throw error;
    });
};
