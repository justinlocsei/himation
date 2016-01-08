'use strict';

var express = require('express');
var request = require('supertest');
var sinon = require('sinon');

var factories = require('chiton-test/support/factories');

var addRouteAssets = require('chiton/server/middleware/add-route-assets');
var routing = require('chiton/core/routing');

describe('chiton/server/middleware/add-route-assets', function() {

  function buildStats() {
    return factories.buildStats();
  }

  function makeRoutes() {
    return [
      {
        name: 'has-assets',
        path: '/has-assets'
      },
      {
        name: 'lacks-assets',
        path: '/lacks-assets'
      }
    ];
  }

  var sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  describe('.create', function() {

    it('creates an Express middleware function', function() {
      var middleware = addRouteAssets.create(buildStats(), 'http://example.com', makeRoutes());
      assert.isFunction(middleware);
      assert.equal(middleware.length, 3);
    });

    it('adds a response local defining assets', function(done) {
      var app = express();
      app.use(addRouteAssets.create(buildStats(), 'http://example.com', makeRoutes()));
      app.get('/has-assets', (req, res) => res.json(res.locals));

      request(app).get('/has-assets')
        .expect(200)
        .expect(function(res) {
          assert.isObject(res.body.assets);
          assert.isArray(res.body.assets.javascripts);
          assert.isArray(res.body.assets.stylesheets);
        })
        .end(done);
    });

    describe('asset matching', function() {

      function makeApp(assets, host, assetUrl) {
        var stats = buildStats();
        stats.assets['has-assets'] = assets;
        stats.url = assetUrl || '/';

        var routes = makeRoutes();
        var pathToRoute = sandbox.stub(routing, 'pathToRoute');
        pathToRoute.withArgs(routes, '/has-assets').returns('has-assets');
        pathToRoute.withArgs(routes, '/lacks-assets').returns('lacks-assets');

        var app = express();
        app.use(addRouteAssets.create(stats, host, routes));

        app.get('/has-assets', (req, res) => res.json(res.locals));
        app.get('/lacks-assets', (req, res) => res.json(res.locals));

        return app;
      }

      it('adds assets when a path maps to a route mentioned in the build-stats asset list', function(done) {
        var app = makeApp(['test.js', 'test.css'], 'http://example.com');

        request(app).get('/has-assets')
          .expect({
            assets: {
              javascripts: ['http://example.com/test.js'],
              stylesheets: ['http://example.com/test.css']
            }
          })
          .end(done);
      });

      it('uses empty asset lists when a path maps to a route not mentioned in the build stats', function(done) {
        var app = makeApp(['test.js', 'test.css'], 'http://example.com');

        request(app).get('/lacks-assets')
          .expect(200)
          .expect({
            assets: {
              javascripts: [],
              stylesheets: []
            }
          })
          .end(done);
      });

      it('includes source files and source maps for each asset type', function(done) {
        var files = [
          'testjs',
          'test.js',
          'test.js.map',
          'testcss',
          'test.css',
          'test.css.map'
        ];
        var app = makeApp(files, 'http://example.com');

        request(app).get('/has-assets')
          .expect({
            assets: {
              javascripts: [
                'http://example.com/test.js',
                'http://example.com/test.js.map'
              ],
              stylesheets: [
                'http://example.com/test.css',
                'http://example.com/test.css.map'
              ]
            }
          })
          .end(done);
      });

      it('supports protocol-relative paths to the assets', function(done) {
        var app = makeApp(['test.js', 'test.css'], '//example.net');

        request(app).get('/has-assets')
          .expect({
            assets: {
              javascripts: ['//example.net/test.js'],
              stylesheets: ['//example.net/test.css']
            }
          })
          .end(done);
      });

      it('respects non-root paths to the assets in the build stats', function(done) {
        var app = makeApp(['test.js', 'test.css'], 'http://example.com', '/assets');

        request(app).get('/has-assets')
          .expect({
            assets: {
              javascripts: ['http://example.com/assets/test.js'],
              stylesheets: ['http://example.com/assets/test.css']
            }
          })
          .end(done);
      });

    });

  });

});
