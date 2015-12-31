'use strict';

var routes = require('chiton/config/routes');

describe('config/routes', function() {

  it('defines a single entry point', function() {
    assert.equal(routes.length, 1);
  });

  it('is mounted at the root', function() {
    assert.equal(routes[0].url, '/');
  });

});
