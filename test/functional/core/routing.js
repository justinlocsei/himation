'use strict';

var routing = require('chiton/core/routing');

describe('routing', function() {

  var routes = [
    {
      name: 'root',
      url: '/',
      urls: [
        {url: 'about', name: 'about'},
        {url: 'about-us', name: 'aboutUs'},
        {url: 'admin', name: 'admin', urls: [
          {url: 'account', name: 'account'}
        ]}
      ]
    },
    {
      name: 'sub',
      url: '/sub'
    }
  ];

  describe('.resolve', function() {

    it('resolves the index URL to a route name', function() {
      assert.equal(routing.resolve(routes, '/'), 'root');
    });

    it('resolves a URL to a route name', function() {
      assert.equal(routing.resolve(routes, '/about'), 'root.about');
    });

    it('uses the full URL for matching', function() {
      assert.equal(routing.resolve(routes, '/about-us'), 'root.aboutUs');
    });

    it('resolves a nested index URL to a route name', function() {
      assert.equal(routing.resolve(routes, '/admin'), 'root.admin');
    });

    it('resolves a nested URL to a route name', function() {
      assert.equal(routing.resolve(routes, '/admin/account'), 'root.admin.account');
    });

    it('resolves a index URL not mounted at the root URL', function() {
      assert.equal(routing.resolve(routes, '/sub'), 'sub');
    });

    it('ignores trailing slashes', function() {
      assert.equal(routing.resolve(routes, '/about/'), 'root.about');
      assert.equal(routing.resolve(routes, '/admin/'), 'root.admin');
      assert.equal(routing.resolve(routes, '/admin/account/'), 'root.admin.account');
    });

    it('returns null when a URL does not match a route', function() {
      assert.isNull(routing.resolve(routes, '/home'));
    });

    it('returns null when a URL partially matches a nested route', function() {
      assert.isNull(routing.resolve(routes, '/admin/missing'));
    });

    it('throws an error when multiple routes match a path', function() {
      var ambiguous = routes.concat(routes);
      assert.throws(function() { routing.resolve(ambiguous, '/'); }, routing.UrlError);
    });

  });

  describe('.url', function() {

    it('returns the URL for the index route', function() {
      assert.equal(routing.url(routes, 'root'), '/');
    });

    it('returns the URL for a top-level route', function() {
      assert.equal(routing.url(routes, 'root.about'), '/about');
    });

    it('returns the URL for a nested index route', function() {
      assert.equal(routing.url(routes, 'root.admin'), '/admin');
    });

    it('returns the URL for a nested route', function() {
      assert.equal(routing.url(routes, 'root.admin.account'), '/admin/account');
    });

    it('returns the URL for an index route not mounted at the root URL', function() {
      assert.equal(routing.url(routes, 'sub'), '/sub');
    });

    it('throws an error when a named route is not defined', function() {
      assert.throws(function() { routing.url(routes, 'home'); }, routing.UrlError);
    });

    it('throws an error when any component of a named route is not defined', function() {
      assert.throws(function() { routing.url(routes, 'root.posts'); }, routing.UrlError);
      assert.throws(function() { routing.url(routes, 'root.admin.posts'); }, routing.UrlError);
    });

    it('throws an error when there are multiple routes with the same name', function() {
      var ambiguous = routes.concat(routes);
      assert.throws(function() { routing.url(ambiguous, 'root'); }, routing.UrlError);
    });

    it('throws an error when a route is missing a URL', function() {
      var missing = [{name: 'root', url: '/'}, {name: 'missing'}];
      assert.throws(function() { routing.url(missing, 'missing'); }, routing.UrlError);
    });

  });

});