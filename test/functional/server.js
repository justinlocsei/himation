'use strict';

var http = require('http');
var https = require('https');
var sinon = require('sinon');

var factories = require('himation-test/support/factories');

var application = require('himation/server/application');
var addRouteAssets = require('himation/server/middleware/add-route-assets');
var paths = require('himation/core/paths');
var routes = require('himation/config/routes');
var routers = require('himation/server/routers');
var Server = require('himation/server');
var webpackBuild = require('himation/config/webpack/build');
var webpackConfigs = require('himation/config/webpack/configs');

describe('Server', function() {

  var sandbox = sinon.sandbox.create();

  var loadManifest;
  var buildManifest = factories.buildManifest();

  beforeEach(function() {
    loadManifest = sandbox.stub(webpackBuild, 'loadManifest');
    loadManifest.returns(buildManifest);
  });

  afterEach(function() {
    sandbox.restore();
  });

  function options() {
    return factories.settings({
      servers: {
        app: {
          host: '127.0.0.1',
          port: 3000
        },
        assets: {
          host: '127.0.0.1',
          port: 3001
        }
      }
    });
  }

  it('accepts a Himation settings object', function() {
    var server = new Server(options());
    assert.isObject(server);
  });

  describe('#start', function() {

    var server;

    beforeEach(function() {
      server = new Server(options());
    });

    afterEach(function() {
      return server.stop().then(() => server = undefined);
    });

    it('creates an application instance that uses the template directory', function() {
      var create = sandbox.spy(application, 'create');

      return server.start().then(function() {
        var params = create.args[0][0];
        assert.equal(params.templatesDirectory, paths.ui.templates);
      });
    });

    it('creates asset-mapping middleware derived from the UI build', function() {
      var uiBuild = sandbox.spy(webpackConfigs, 'ui');
      var createMiddleware = sandbox.spy(addRouteAssets, 'create');

      return server.start().then(function() {
        assert.isTrue(uiBuild.called);
        assert.equal(uiBuild.args[0][0].servers.assets.port, 3001);

        assert.isTrue(loadManifest.called);
        assert.equal(loadManifest.args[0][0].target, 'web');

        assert.isTrue(createMiddleware.called);
        var middlewareArgs = createMiddleware.args[0];
        assert.equal(middlewareArgs[0], buildManifest);
        assert.equal(middlewareArgs[1], 'http://127.0.0.1:3001');
        assert.equal(middlewareArgs[2], routes);
      });
    });

    it('creates a router for the application', function() {
      var create = sandbox.spy(routers, 'create');

      return server.start().then(function() {
        assert.isTrue(create.called);
      });
    });

    it('binds the server to the port and address of the app server from the configuration', function() {
      return server.start().then(function(app) {
        var binding = app.address();
        assert.equal(binding.address, '127.0.0.1');
        assert.equal(binding.port, 3000);
      });
    });

    it('matches the protocol for the app server to the configuration', function() {
      var unsecure = sandbox.spy(http, 'createServer');
      var secure = sandbox.spy(https, 'createServer');

      server.settings.servers.app.protocol = 'https';
      return server.start().then(function() {
        assert.isTrue(secure.called);
        assert.isFalse(unsecure.called);
      });
    });

    it('returns a promise that is fulfilled when the server is ready', function() {
      return assert.isFulfilled(server.start());
    });

    it('returns a promise that is rejected if the server cannot be bound', function() {
      server.settings.servers.app.host = '127.0.0.2';
      return assert.isRejected(server.start());
    });

    it('returns a fulfilled promise if the server is already running', function() {
      return assert.isFulfilled(server.start().then(() => server.start()));
    });

  });

  describe('#stop', function() {

    var server;

    beforeEach(function() {
      server = new Server(options());
    });

    afterEach(function() {
      return server.stop().then(() => server = undefined);
    });

    it('stops the server', function() {
      return server.start()
        .tap(app => assert.equal(app.address().port, 3000))
        .then(() => server.stop())
        .tap(app => assert.notOk(app.address()));
    });

    it('returns a promise that is fulfilled when the server is shut down', function() {
      return assert.isFulfilled(server.start().then(() => server.stop()));
    });

    it('returns a fulfilled promise if the server is not running', function() {
      return assert.isFulfilled(server.stop());
    });

    it('is idempotent', function() {
      return assert.isFulfilled(server.stop().then(() => server.stop()));
    });

  });

});
