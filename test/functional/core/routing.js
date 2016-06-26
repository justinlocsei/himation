'use strict';

var errors = require('himation/core/errors');
var routing = require('himation/core/routing');

describe('core/routing', function() {

  function buildDefinitions() {
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

    it('throws an error when multiple routes share a path and method', function() {
      var routes = [
        {name: 'first', path: '/', method: 'get'},
        {name: 'second', path: '/', method: 'get'}
      ];

      assert.throws(function() { routing.defineRoutes(routes); }, errors.ConfigurationError);
    });

    it('throws an error when a route lacks a name', function() {
      assert.throws(function() { routing.defineRoutes([{name: '/'}]); }, errors.ConfigurationError);
    });

    it('throws an error when a route lacks a path', function() {
      assert.throws(function() { routing.defineRoutes([{path: '/'}]); }, errors.ConfigurationError);
    });

  });

  describe('.pathToRoute', function() {

    function buildRoutes() {
      return [
        {path: '/', guid: 'root.index', method: 'get'},
        {path: '/about', guid: 'root.about', method: 'get'},
        {path: '/about-us', guid: 'root.about-us', method: 'get'},
        {path: '/log-out', guid: 'root.log-out', method: 'post'},
        {path: '/admin', guid: 'root.admin.index', method: 'get'},
        {path: '/admin/account', guid: 'root.admin.view-account', method: 'get'},
        {path: '/admin/account', guid: 'root.admin.update-account', method: 'put'}
      ];
    }

    it('resolves the index URL to the index route', function() {
      var result = routing.pathToRoute(buildRoutes(), '/');

      assert.deepEqual(result, {
        guid: 'root.index',
        path: '/',
        method: 'get'
      });
    });

    it('resolves the index URL to the index route', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/').guid, 'root.index');
    });

    it('resolves a non-index URL to a route', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/about').guid, 'root.about');
    });

    it('ignores case when matching routes', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/ABOUT').guid, 'root.about');
    });

    it('uses the full URL for matching', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/about-us').guid, 'root.about-us');
    });

    it('resolves a nested index URL to a route', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/admin').guid, 'root.admin.index');
    });

    it('resolves a nested URL to a route', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/admin/account').guid, 'root.admin.view-account');
    });

    it('ignores trailing slashes', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/about/').guid, 'root.about');
      assert.equal(routing.pathToRoute(buildRoutes(), '/admin/').guid, 'root.admin.index');
      assert.equal(routing.pathToRoute(buildRoutes(), '/admin/account/').guid, 'root.admin.view-account');
    });

    it('takes the HTTP method into account when a route defines one', function() {
      assert.isNull(routing.pathToRoute(buildRoutes(), '/log-out', 'get'));
      assert.equal(routing.pathToRoute(buildRoutes(), '/log-out', 'post').guid, 'root.log-out');
    });

    it('uses the method to disambiguate otherwise identical paths', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/admin/account', 'get').guid, 'root.admin.view-account');
      assert.equal(routing.pathToRoute(buildRoutes(), '/admin/account', 'put').guid, 'root.admin.update-account');
    });

    it('ignores case when matching on methods', function() {
      assert.equal(routing.pathToRoute(buildRoutes(), '/admin/account', 'PUT').guid, 'root.admin.update-account');
    });

    it('returns null when a URL does not match a route', function() {
      assert.isNull(routing.pathToRoute(buildRoutes(), '/home'));
    });

    it('returns null when a URL partially matches a nested route', function() {
      assert.isNull(routing.pathToRoute(buildRoutes(), '/admin/missing'));
    });

  });

  describe('.resolveRouteDefinitionPath', function() {

    it('returns the URL for the index route', function() {
      assert.equal(routing.resolveRouteDefinitionPath(buildDefinitions(), 'root.index'), '/');
    });

    it('returns the URL for a top-level route', function() {
      assert.equal(routing.resolveRouteDefinitionPath(buildDefinitions(), 'root.about'), '/about');
    });

    it('returns the URL for a nested index route', function() {
      assert.equal(routing.resolveRouteDefinitionPath(buildDefinitions(), 'root.admin.index'), '/admin');
    });

    it('returns the URL for a nested route', function() {
      assert.equal(routing.resolveRouteDefinitionPath(buildDefinitions(), 'root.admin.view-account'), '/admin/account');
    });

    it('returns the URL for an index route not mounted at the root URL', function() {
      assert.equal(routing.resolveRouteDefinitionPath(buildDefinitions(), 'sub'), '/sub');
    });

    it('throws an error when a named route is not defined', function() {
      assert.throws(function() { routing.resolveRouteDefinitionPath(buildDefinitions(), 'home'); }, errors.ConfigurationError);
    });

    it('throws an error when any component of a named route is not defined', function() {
      assert.throws(function() { routing.resolveRouteDefinitionPath(buildDefinitions(), 'root.posts'); }, errors.ConfigurationError);
      assert.throws(function() { routing.resolveRouteDefinitionPath(buildDefinitions(), 'root.admin.posts'); }, errors.ConfigurationError);
    });

    it('throws an error when there are multiple routes with the same name', function() {
      var ambiguous = buildDefinitions().concat(buildDefinitions());
      assert.throws(function() { routing.resolveRouteDefinitionPath(ambiguous, 'root'); }, errors.ConfigurationError);
    });

    it('throws an error when a route is missing a URL', function() {
      var missing = [{name: 'root', path: '/'}, {name: 'missing'}];
      assert.throws(function() { routing.resolveRouteDefinitionPath(missing, 'missing'); }, errors.ConfigurationError);
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
