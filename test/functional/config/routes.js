'use strict';

var pluck = require('lodash/pluck');

var routes = require('himation/config/routes');

describe('config/routes', function() {

  it('is a series of unique routes', function() {
    var guids = pluck(routes, 'guid');

    assert.isAbove(routes.length, 0);
    assert.equal(routes.length, guids.length);
  });

  it('is mounted at the root', function() {
    assert.equal(routes[0].path, '/');
  });

});
