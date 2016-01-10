'use strict';

var _ = require('lodash');

var routes = require('chiton/config/routes');

describe('config/routes', function() {

  it('is a series of unique routes', function() {
    var guids = _.pluck(routes, 'guid');

    assert.isAbove(routes.length, 0);
    assert.equal(routes.length, guids.length);
  });

  it('is mounted at the root', function() {
    assert.equal(routes[0].path, '/');
  });

});
