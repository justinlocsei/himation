'use strict';

var express = require('express');
var request = require('supertest');

var factories = require('himation-test/support/factories');

var addRouteAssets = require('himation/server/middleware/add-route-assets');

describe('server/middleware/add-route-assets', function() {

  function buildManifest() {
    return factories.buildManifest();
  }

  function makeRoutes() {
    return [
      {guid: 'has-assets', path: '/has-assets', method: 'get'},
      {guid: 'lacks-assets', path: '/lacks-assets', method: 'get'}
    ];
  }

  describe('.create', function() {

    it('creates an Express middleware function', function() {
      var middleware = addRouteAssets.create(buildManifest(), 'http://example.com', makeRoutes());
      assert.isFunction(middleware);
      assert.equal(middleware.length, 3);
    });

    it('adds a response local defining assets', function(done) {
      var app = express();
      app.use(addRouteAssets.create(buildManifest(), 'http://example.com', makeRoutes()));
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
        var manifest = buildManifest();
        manifest.assets['has-assets'] = assets;
        manifest.url = assetUrl || '/';

        var app = express();
        app.use(addRouteAssets.create(manifest, host, makeRoutes()));

        app.get('/has-assets', (req, res) => res.json(res.locals));
        app.get('/lacks-assets', (req, res) => res.json(res.locals));

        return app;
      }

      it('adds assets when a path maps to a route mentioned in the build-manifest asset list', function(done) {
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

      it('uses empty asset lists when a path maps to a route not mentioned in the build manifest', function(done) {
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

      it('includes only source files for each asset type', function(done) {
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
              javascripts: ['http://example.com/test.js'],
              stylesheets: ['http://example.com/test.css']
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

      it('respects non-root paths to the assets in the build manifest', function(done) {
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
