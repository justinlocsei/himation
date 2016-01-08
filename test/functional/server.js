'use strict';

var http = require('http');
var https = require('https');
var sinon = require('sinon');

var application = require('chiton/server/application');
var paths = require('chiton/core/paths');
var Server = require('chiton/server');
var settings = require('chiton/config/settings');

describe('Server', function() {

  var sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  function options() {
    return settings.customize({
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

  it('accepts a Chiton settings object', function() {
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
