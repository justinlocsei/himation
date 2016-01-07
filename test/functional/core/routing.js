'use strict';

var errors = require('chiton/core/errors');
var routing = require('chiton/core/routing');

describe('core/routing', function() {

  function routes() {
    return [
      {
        name: 'root',
        path: '/',
        paths: [
          {path: 'about', name: 'about'},
          {path: 'about-us', name: 'aboutUs'},
          {path: 'admin', name: 'admin', paths: [
            {path: 'account', name: 'account'}
          ]}
        ]
      },
      {
        name: 'sub',
        path: '/sub'
      }
    ];
  }

  describe('.routesToGuids', function() {

    function nested() {
      return [
        {
          name: 'one',
          path: '/',
          paths: [
            {path: 'two', name: 'two'},
            {path: 'three', name: 'three', paths: [
              {path: 'four', name: 'four'}
            ]},
            {path: 'five', name: 'five'}
          ]
        }
      ];
    }

    it('creates a flat map of GUIDs', function() {
      var guids = routing.routesToGuids(nested());
      assert.equal(Object.keys(guids).length, 5);
    });

    it('generates GUIDs for each route based upon its level', function() {
      var guids = routing.routesToGuids(nested());

      assert.deepEqual(guids, {
        'one.index': ['one', 'index'],
        'one.two': ['one', 'two'],
        'one.three.index': ['one', 'three', 'index'],
        'one.three.four': ['one', 'three', 'four'],
        'one.five': ['one', 'five']
      });
    });

    it('can use the GUIDs to look up route URLs', function() {
      var guids = routing.routesToGuids(nested());
      var urls = Object.keys(guids).map(route => routing.routeToPath(nested(), route));

      assert.deepEqual(urls.sort(), [
        '/',
        '/five',
        '/three',
        '/three/four',
        '/two'
      ]);
    });

  });

  describe('.pathToRoute', function() {

    it('resolves the index URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes(), '/'), 'root.index');
    });

    it('resolves a URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes(), '/about'), 'root.about');
    });

    it('uses the full URL for matching', function() {
      assert.equal(routing.pathToRoute(routes(), '/about-us'), 'root.aboutUs');
    });

    it('resolves a nested index URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes(), '/admin'), 'root.admin.index');
    });

    it('resolves a nested URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes(), '/admin/account'), 'root.admin.account');
    });

    it('resolves a index URL not mounted at the root URL', function() {
      assert.equal(routing.pathToRoute(routes(), '/sub'), 'sub');
    });

    it('ignores trailing slashes', function() {
      assert.equal(routing.pathToRoute(routes(), '/about/'), 'root.about');
      assert.equal(routing.pathToRoute(routes(), '/admin/'), 'root.admin.index');
      assert.equal(routing.pathToRoute(routes(), '/admin/account/'), 'root.admin.account');
    });

    it('returns null when a URL does not match a route', function() {
      assert.isNull(routing.pathToRoute(routes(), '/home'));
    });

    it('returns null when a URL partially matches a nested route', function() {
      assert.isNull(routing.pathToRoute(routes(), '/admin/missing'));
    });

    it('throws an error when multiple routes match a path', function() {
      var ambiguous = routes().concat(routes());
      assert.throws(function() { routing.pathToRoute(ambiguous, '/'); }, errors.ConfigurationError);
    });

    it('throws an error when a matched route lacks a name', function() {
      var malformed = routes();
      delete malformed[0].name;
      assert.throws(function() { routing.pathToRoute(malformed, '/'); }, errors.ConfigurationError);
    });

  });

  describe('.routeToPath', function() {

    it('returns the URL for the index route', function() {
      assert.equal(routing.routeToPath(routes(), 'root.index'), '/');
    });

    it('returns the URL for a top-level route', function() {
      assert.equal(routing.routeToPath(routes(), 'root.about'), '/about');
    });

    it('returns the URL for a nested index route', function() {
      assert.equal(routing.routeToPath(routes(), 'root.admin.index'), '/admin');
    });

    it('returns the URL for a nested route', function() {
      assert.equal(routing.routeToPath(routes(), 'root.admin.account'), '/admin/account');
    });

    it('returns the URL for an index route not mounted at the root URL', function() {
      assert.equal(routing.routeToPath(routes(), 'sub'), '/sub');
    });

    it('throws an error when a named route is not defined', function() {
      assert.throws(function() { routing.routeToPath(routes(), 'home'); }, errors.ConfigurationError);
    });

    it('throws an error when any component of a named route is not defined', function() {
      assert.throws(function() { routing.routeToPath(routes(), 'root.posts'); }, errors.ConfigurationError);
      assert.throws(function() { routing.routeToPath(routes(), 'root.admin.posts'); }, errors.ConfigurationError);
    });

    it('throws an error when there are multiple routes with the same name', function() {
      var ambiguous = routes().concat(routes());
      assert.throws(function() { routing.routeToPath(ambiguous, 'root'); }, errors.ConfigurationError);
    });

    it('throws an error when a route is missing a URL', function() {
      var missing = [{name: 'root', path: '/'}, {name: 'missing'}];
      assert.throws(function() { routing.routeToPath(missing, 'missing'); }, errors.ConfigurationError);
    });

  });

  describe('.guidToNamespaces', function() {

    it('split a GUID into a list of namespaces', function() {
      var namespaces = routing.guidToNamespaces('one.two.three');
      assert.deepEqual(namespaces, ['one', 'two', 'three']);
    });

  });

  describe('.namespacesToGuid', function() {

    it('combines a list of namespaces into a route GUID', function() {
      var guid = routing.namespacesToGuid(['one', 'two', 'three']);
      assert.equal(guid, 'one.two.three');
    });

  });

});
