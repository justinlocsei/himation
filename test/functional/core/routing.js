'use strict';

var errors = require('chiton/core/errors');
var routing = require('chiton/core/routing');

describe('core/routing', function() {

  function definitions() {
    return [
      {
        name: 'root',
        path: '/',
        paths: [
          {path: 'about', name: 'about'},
          {path: 'about-us', name: 'about-us'},
          {path: 'log-out', name: 'log-out', method: 'post'},
          {path: 'admin', name: 'admin', paths: [
            {path: 'account', name: 'view-account', method: 'get'},
            {path: 'account', name: 'update-account', method: 'put'}
          ]}
        ]
      },
      {
        name: 'sub',
        path: '/sub'
      }
    ];
  }

  describe('.defineRoutes', function() {

    it('converts route definitions into routes', function() {
      var result = routing.defineRoutes([
        {name: 'root', path: '/', method: 'get'}
      ]);

      assert.deepEqual(result, [
        {guid: 'root', path: '/', method: 'get'}
      ]);
    });

    it('uses GET as the default method', function() {
      var result = routing.defineRoutes([
        {name: 'root', path: '/'}
      ]);

      assert.equal(result.length, 1);
      assert.equal(result[0].method, 'get');
    });

    it('respects an explicit HTTP method', function() {
      var result = routing.defineRoutes([
        {name: 'root', path: '/', method: 'post'}
      ]);

      assert.equal(result.length, 1);
      assert.equal(result[0].method, 'post');
    });

    it('normalizes the formatting of HTTP methods', function() {
      var result = routing.defineRoutes([
        {name: 'root', path: '/', method: 'POST'}
      ]);

      assert.equal(result.length, 1);
      assert.equal(result[0].method, 'post');
    });

    it('flattens the route definition using route GUIDs', function() {
      var result = routing.defineRoutes([
        {name: 'root', path: '/', method: 'get', paths: [
          {name: 'one', path: 'one'},
          {name: 'two', path: 'two'}
        ]}
      ]);

      assert.deepEqual(result, [
        {guid: 'root.index', path: '/', method: 'get'},
        {guid: 'root.one', path: '/one', method: 'get'},
        {guid: 'root.two', path: '/two', method: 'get'}
      ]);
    });

  });

  describe('.routesToGuids', function() {

    function nestedDefinitions() {
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
      var guids = routing.routesToGuids(nestedDefinitions());
      assert.equal(Object.keys(guids).length, 5);
    });

    it('generates GUIDs for each route based upon its level', function() {
      var guids = routing.routesToGuids(nestedDefinitions());

      assert.deepEqual(guids, {
        'one.index': ['one', 'index'],
        'one.two': ['one', 'two'],
        'one.three.index': ['one', 'three', 'index'],
        'one.three.four': ['one', 'three', 'four'],
        'one.five': ['one', 'five']
      });
    });

    it('can use the GUIDs to look up route URLs', function() {
      var guids = routing.routesToGuids(nestedDefinitions());
      var urls = Object.keys(guids).map(route => routing.routeToPath(nestedDefinitions(), route));

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
      assert.equal(routing.pathToRoute(definitions(), '/'), 'root.index');
    });

    it('resolves a URL to a route name', function() {
      assert.equal(routing.pathToRoute(definitions(), '/about'), 'root.about');
    });

    it('uses the full URL for matching', function() {
      assert.equal(routing.pathToRoute(definitions(), '/about-us'), 'root.about-us');
    });

    it('resolves a nested index URL to a route name', function() {
      assert.equal(routing.pathToRoute(definitions(), '/admin'), 'root.admin.index');
    });

    it('resolves a nested URL to a route name', function() {
      assert.equal(routing.pathToRoute(definitions(), '/admin/account'), 'root.admin.view-account');
    });

    it('resolves an index URL not mounted at the root URL', function() {
      assert.equal(routing.pathToRoute(definitions(), '/sub'), 'sub');
    });

    it('ignores trailing slashes', function() {
      assert.equal(routing.pathToRoute(definitions(), '/about/'), 'root.about');
      assert.equal(routing.pathToRoute(definitions(), '/admin/'), 'root.admin.index');
      assert.equal(routing.pathToRoute(definitions(), '/admin/account/'), 'root.admin.view-account');
    });

    it('takes the HTTP method into account when a route defines one', function() {
      assert.isNull(routing.pathToRoute(definitions(), '/log-out', 'get'));
      assert.equal(routing.pathToRoute(definitions(), '/log-out', 'post'), 'root.log-out');
    });

    it('uses the method to disambiguate otherwise identical paths', function() {
      assert.equal(routing.pathToRoute(definitions(), '/admin/account', 'get'), 'root.admin.view-account');
      assert.equal(routing.pathToRoute(definitions(), '/admin/account', 'put'), 'root.admin.update-account');
    });

    it('ignores case when matching on methods', function() {
      assert.equal(routing.pathToRoute(definitions(), '/admin/account', 'PUT'), 'root.admin.update-account');
    });

    it('returns null when a URL does not match a route', function() {
      assert.isNull(routing.pathToRoute(definitions(), '/home'));
    });

    it('returns null when a URL partially matches a nested route', function() {
      assert.isNull(routing.pathToRoute(definitions(), '/admin/missing'));
    });

    it('throws an error when multiple routes match a path', function() {
      var ambiguous = definitions().concat(definitions());
      assert.throws(function() { routing.pathToRoute(ambiguous, '/'); }, errors.ConfigurationError);
    });

    it('throws an error when a matched route lacks a name', function() {
      var malformed = definitions();
      delete malformed[0].name;
      assert.throws(function() { routing.pathToRoute(malformed, '/'); }, errors.ConfigurationError);
    });

  });

  describe('.routeToPath', function() {

    it('returns the URL for the index route', function() {
      assert.equal(routing.routeToPath(definitions(), 'root.index'), '/');
    });

    it('returns the URL for a top-level route', function() {
      assert.equal(routing.routeToPath(definitions(), 'root.about'), '/about');
    });

    it('returns the URL for a nested index route', function() {
      assert.equal(routing.routeToPath(definitions(), 'root.admin.index'), '/admin');
    });

    it('returns the URL for a nested route', function() {
      assert.equal(routing.routeToPath(definitions(), 'root.admin.view-account'), '/admin/account');
    });

    it('returns the URL for an index route not mounted at the root URL', function() {
      assert.equal(routing.routeToPath(definitions(), 'sub'), '/sub');
    });

    it('throws an error when a named route is not defined', function() {
      assert.throws(function() { routing.routeToPath(definitions(), 'home'); }, errors.ConfigurationError);
    });

    it('throws an error when any component of a named route is not defined', function() {
      assert.throws(function() { routing.routeToPath(definitions(), 'root.posts'); }, errors.ConfigurationError);
      assert.throws(function() { routing.routeToPath(definitions(), 'root.admin.posts'); }, errors.ConfigurationError);
    });

    it('throws an error when there are multiple routes with the same name', function() {
      var ambiguous = definitions().concat(definitions());
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
