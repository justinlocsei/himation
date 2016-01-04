'use strict';

var sources = require('chiton/config/webpack/sources');

describe('config/webpack/sources', function() {

  describe('.commons', function() {

    it('creates a commons chunk for entry points that share a hierarchy level', function() {
      var commons = sources.commons({
        'test.one': './test/one',
        'test.two': './test/two'
      });

      assert.equal(commons.length, 1);

      assert.deepEqual(commons[0], {
        chunks: ['test.one', 'test.two'],
        filename: 'commons--test--[hash].js',
        name: 'commons.test'
      });
    });

    it('creates separate commons chunks for nested routes that share a namespace', function() {
      var commons = sources.commons({
        'one.one': './one/one',
        'one.two': './one/two',
        'one.three.index': './one/three/index',
        'one.three.one': './one/three/one',
        'one.four.index': './one/four/index',
        'one.four.one.index': './one/four/one/index',
        'one.four.one.two': './one/four/one/two'
      });

      assert.equal(commons.length, 4);

      assert.deepEqual(commons[0], {
        chunks: [
          'one.one', 'one.two',
          'one.three.index', 'one.three.one',
          'one.four.index', 'one.four.one.index', 'one.four.one.two'
        ],
        filename: 'commons--one--[hash].js',
        name: 'commons.one'
      });

      assert.deepEqual(commons[1], {
        chunks: ['one.three.index', 'one.three.one'],
        filename: 'commons--one--three--[hash].js',
        name: 'commons.one.three'
      });

      assert.deepEqual(commons[2], {
        chunks: ['one.four.index', 'one.four.one.index', 'one.four.one.two'],
        filename: 'commons--one--four--[hash].js',
        name: 'commons.one.four'
      });

      assert.deepEqual(commons[3], {
        chunks: ['one.four.one.index', 'one.four.one.two'],
        filename: 'commons--one--four--one--[hash].js',
        name: 'commons.one.four.one'
      });
    });

    it('does not create commons chunks for routes that do not share a namespace', function() {
      var commons = sources.commons({
        'test.one': './test/one',
        'test.two': './test/two',
        'one': './one',
        'two': './two'
      });

      assert.equal(commons.length, 1);
      assert.deepEqual(commons[0].chunks, ['test.one', 'test.two']);
    });

  });

  describe('.entries', function() {

    describe('with a single root route', function() {

      var routes = [
        {
          name: 'test',
          url: '/',
          urls: [
            {url: 'about', name: 'about'},
            {url: 'admin', name: 'admin', urls: [
              {url: 'account', name: 'account'}
            ]}
          ]
        }
      ];

      it('maps the root route for a namespace to an index module', function() {
        var entries = sources.entries(routes);
        assert.equal(entries['test.index'], './test/index');
      });

      it('creates a flat map of entry-point names to relative module paths', function() {
        var entries = sources.entries(routes);

        assert.deepEqual(entries, {
          'test.index': './test/index',
          'test.about': './test/about',
          'test.admin.index': './test/admin/index',
          'test.admin.account': './test/admin/account'
        });
      });

      it('accepts a root route that is removed from the module path', function() {
        var entries = sources.entries(routes, {root: 'test'});

        assert.deepEqual(entries, {
          'test.index': './index',
          'test.about': './about',
          'test.admin.index': './admin/index',
          'test.admin.account': './admin/account'
        });
      });

      it('accepts a namespace that is added to each entry point', function() {
        var entries = sources.entries(routes, {namespace: ['one', 'two']});

        assert.deepEqual(entries, {
          'one.two.test.index': './test/index',
          'one.two.test.about': './test/about',
          'one.two.test.admin.index': './test/admin/index',
          'one.two.test.admin.account': './test/admin/account'
        });
      });

      it('accepts a module namespace that is added to each entry point', function() {
        var entries = sources.entries(routes, {module: ['one', 'two']});

        assert.deepEqual(entries, {
          'test.index': './one/two/test/index',
          'test.about': './one/two/test/about',
          'test.admin.index': './one/two/test/admin/index',
          'test.admin.account': './one/two/test/admin/account'
        });
      });

      it('can combine a root route with a namespace and module path', function() {
        var entries = sources.entries(routes, {root: 'test', namespace: ['namespace'], module: ['module']});

        assert.deepEqual(entries, {
          'namespace.test.index': './module/index',
          'namespace.test.about': './module/about',
          'namespace.test.admin.index': './module/admin/index',
          'namespace.test.admin.account': './module/admin/account'
        });
      });

    });

    describe('with multiple root routes', function() {

      var routes = [
        {name: 'one', url: '/one'},
        {name: 'two', url: '/two'}
      ];

      it('uses a flat structure', function() {
        var entries = sources.entries(routes);

        assert.deepEqual(entries, {
          'one': './one',
          'two': './two'
        });
      });

      it('applies the root route to a single route', function() {
        var entries = sources.entries(routes, {root: 'one'});

        assert.deepEqual(entries, {
          'one': './index',
          'two': './two'
        });
      });

      it('applies the namespace to each route', function() {
        var entries = sources.entries(routes, {namespace: ['prefix']});

        assert.deepEqual(entries, {
          'prefix.one': './one',
          'prefix.two': './two'
        });
      });

      it('applies the module path to each route', function() {
        var entries = sources.entries(routes, {module: ['prefix']});

        assert.deepEqual(entries, {
          'one': './prefix/one',
          'two': './prefix/two'
        });
      });

    });

  });

});
