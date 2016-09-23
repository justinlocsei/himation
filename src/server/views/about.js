'use strict';

var caching = require('himation/server/caching');
var settings = require('himation/core/settings');

var AboutPage = require('himation/ui/containers/pages/about').default;
var rendering = require('himation/ui/rendering');

module.exports = function renderResponse(req, res) {
  var cachedResponse = caching.allowGatewayCaching(res, settings.caching.ttl);
  rendering.prerenderPageComponent(cachedResponse, AboutPage, {
    template: 'pages/about.html'
  });
};
