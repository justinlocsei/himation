'use strict';

var caching = require('himation/server/caching');
var IndexPage = require('himation/ui/containers/pages').default;
var rendering = require('himation/ui/rendering');
var settings = require('himation/core/settings');

module.exports = function renderResponse(req, res) {
  var cachedResponse = caching.allowGatewayCaching(res, settings.caching.ttl);
  rendering.prerenderPageComponent(cachedResponse, IndexPage, {
    template: 'pages/home.html'
  });
};
