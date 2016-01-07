'use strict';

var mockFs = require('mock-fs');
var request = require('supertest');

var application = require('chiton/server/application');
var ConfigurationError = require('chiton/core/errors/configuration-error');

describe('chiton/server/application', function() {

  beforeEach(function() {
    mockFs({
      '/templates': {}
    });
  });

  afterEach(function() {
    mockFs.restore();
  });

  function options() {
    return {
      templatesDirectory: '/templates'
    };
  }

  describe('.create', function() {

    function assertRequiresOption(setting) {
      var settings = options();
      delete settings[setting];

      assert.throws(function() { application.create(settings); }, ConfigurationError);
    }

    it('creates an instance of an Express app', function() {
      var app = application.create(options());
      assert.isFunction(app.use);
    });

    it('throws an error if no templates directory is provided', function() {
      assertRequiresOption('templatesDirectory');
    });

    describe('the application', function() {

      describe('template output', function() {

        function getOutput(context) {
          var app = application.create(options());

          mockFs({
            '/templates': {
              'template.html': '{{ message }}'
            }
          });

          app.get('/', function(req, res) {
            res.render('template.html', context, function(err, output) {
              if (err) {
                res.status(500).send(err.message);
              } else {
                res.send(output);
              }
            });
          });

          return request(app).get('/');
        }

        it('renders Nunjucks templates', function(done) {
          getOutput({message: 'test'}).expect(200, 'test', done);
        });

        it('uses HTML escaping for template variables', function(done) {
          getOutput({message: 'one & two'}).expect(200, 'one &amp; two', done);
        });

        it('throws an error when rendering a undefined variable', function(done) {
          getOutput({other: 'value'}).expect(500, /undefined/, done);
        });

      });

    });

  });

});
