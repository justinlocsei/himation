'use strict';

var routing = require('chiton/core/routing');

describe('core/routing', function() {

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

  describe('.flatten', function() {

    var nested = [
      {
        name: 'one',
        url: '/',
        urls: [
          {url: 'two', name: 'two'},
          {url: 'three', name: 'three', urls: [
            {url: 'four', name: 'four'}
          ]},
          {url: 'five', name: 'five'}
        ]
      }
    ];

    it('creates a non-recursive list', function() {
      var flattened = routing.flatten(nested);
      assert.equal(flattened.length, 5);
    });

    it('generates GUIDs for each route based upon its level', function() {
      var flattened = routing.flatten(nested);

      assert.deepEqual(flattened, [
        'one.index',
        'one.two',
        'one.three.index',
        'one.three.four',
        'one.five'
      ]);
    });

    it('can accept a custom namespace for the GUIDs', function() {
      var flattened = routing.flatten(nested, 'custom');

      assert.deepEqual(flattened, [
        'custom.one.index',
        'custom.one.two',
        'custom.one.three.index',
        'custom.one.three.four',
        'custom.one.five'
      ]);
    });

    it('can use the GUIDs to look up route URLs', function() {
      var flattened = routing.flatten(nested);
      var urls = flattened.map(function(route) { return routing.routeToPath(nested, route); });

      assert.deepEqual(urls, [
        '/',
        '/two',
        '/three',
        '/three/four',
        '/five'
      ]);
    });

  });

  describe('.resolve', function() {

    it('resolves the index URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes, '/'), 'root.index');
    });

    it('resolves a URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes, '/about'), 'root.about');
    });

    it('uses the full URL for matching', function() {
      assert.equal(routing.pathToRoute(routes, '/about-us'), 'root.aboutUs');
    });

    it('resolves a nested index URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes, '/admin'), 'root.admin.index');
    });

    it('resolves a nested URL to a route name', function() {
      assert.equal(routing.pathToRoute(routes, '/admin/account'), 'root.admin.account');
    });

    it('resolves a index URL not mounted at the root URL', function() {
      assert.equal(routing.pathToRoute(routes, '/sub'), 'sub');
    });

    it('ignores trailing slashes', function() {
      assert.equal(routing.pathToRoute(routes, '/about/'), 'root.about');
      assert.equal(routing.pathToRoute(routes, '/admin/'), 'root.admin.index');
      assert.equal(routing.pathToRoute(routes, '/admin/account/'), 'root.admin.account');
    });

    it('returns null when a URL does not match a route', function() {
      assert.isNull(routing.pathToRoute(routes, '/home'));
    });

    it('returns null when a URL partially matches a nested route', function() {
      assert.isNull(routing.pathToRoute(routes, '/admin/missing'));
    });

    it('throws an error when multiple routes match a path', function() {
      var ambiguous = routes.concat(routes);
      assert.throws(function() { routing.pathToRoute(ambiguous, '/'); }, routing.UrlError);
    });

  });

  describe('.url', function() {

    it('returns the URL for the index route', function() {
      assert.equal(routing.routeToPath(routes, 'root.index'), '/');
    });

    it('returns the URL for a top-level route', function() {
      assert.equal(routing.routeToPath(routes, 'root.about'), '/about');
    });

    it('returns the URL for a nested index route', function() {
      assert.equal(routing.routeToPath(routes, 'root.admin.index'), '/admin');
    });

    it('returns the URL for a nested route', function() {
      assert.equal(routing.routeToPath(routes, 'root.admin.account'), '/admin/account');
    });

    it('returns the URL for an index route not mounted at the root URL', function() {
      assert.equal(routing.routeToPath(routes, 'sub'), '/sub');
    });

    it('throws an error when a named route is not defined', function() {
      assert.throws(function() { routing.routeToPath(routes, 'home'); }, routing.UrlError);
    });

    it('throws an error when any component of a named route is not defined', function() {
      assert.throws(function() { routing.routeToPath(routes, 'root.posts'); }, routing.UrlError);
      assert.throws(function() { routing.routeToPath(routes, 'root.admin.posts'); }, routing.UrlError);
    });

    it('throws an error when there are multiple routes with the same name', function() {
      var ambiguous = routes.concat(routes);
      assert.throws(function() { routing.routeToPath(ambiguous, 'root'); }, routing.UrlError);
    });

    it('throws an error when a route is missing a URL', function() {
      var missing = [{name: 'root', url: '/'}, {name: 'missing'}];
      assert.throws(function() { routing.routeToPath(missing, 'missing'); }, routing.UrlError);
    });

  });

});
