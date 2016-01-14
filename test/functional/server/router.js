'use strict';

var express = require('express');
var fs = require('fs');
var request = require('supertest');
var tmp = require('tmp');

var factories = require('himation-test/support/factories');

var routers = require('himation/server/routers');

describe('server/router', function() {

  describe('.create', function() {

    function makeAppWithHandler(route, contents) {
      var handler = tmp.fileSync().name;
      fs.writeFileSync(handler, contents);

      var entries = {};
      entries[route.guid] = handler;
      var manifest = factories.buildManifest({entries: entries});

      var app = express();
      app.use(routers.create(manifest, [route]));

      return app;
    }

    it('creates an Express router from a build manifest and routes', function() {
      var router = routers.create(factories.buildManifest(), factories.routes());
      assert.isFunction(router.route);
    });

    it('binds routes that lazily map to a handler module found in a build manifest that exports a rendering function', function(done) {
      var app = makeAppWithHandler(
        {guid: 'test', path: '/', method: 'get'},
        'module.exports.renderResponse = (req, res) => res.send("Response")'
      );

      request(app).get('/')
        .expect('Response')
        .expect(200, done);
    });

    it('binds routes using the specified method', function(done) {
      var app = makeAppWithHandler(
        {guid: 'test', path: '/', method: 'post'},
        'module.exports.renderResponse = (req, res) => res.send("Response")'
      );

      request(app).post('/')
        .expect('Response')
        .expect(200, done);
    });

    it('exclusively binds routes using the specified method', function(done) {
      var app = makeAppWithHandler(
        {guid: 'test', path: '/', method: 'post'},
        'module.exports.renderResponse = (req, res) => res.send("Response")'
      );

      request(app).get('/').expect(404, done);
    });

  });

});
