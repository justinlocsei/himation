'use strict';

var fs = require('fs');
var path = require('path');
var request = require('supertest');
var tmp = require('tmp');

var application = require('chiton/server/application');
var errors = require('chiton/core/errors');

describe('chiton/server/application', function() {

  function options() {
    return {
      templatesDirectory: tmp.dirSync().name
    };
  }

  describe('.create', function() {

    function assertRequiresOption(setting) {
      var settings = options();
      delete settings[setting];

      assert.throws(function() { application.create(settings); }, errors.ConfigurationError);
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
          var settings = options();
          var app = application.create(settings);
          var directory = settings.templatesDirectory;

          fs.writeFileSync(path.join(directory, 'template.html'), '{{ message }}');

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

      describe('security', function() {

        function checkHeaders() {
          var app = application.create(options());

          app.get('/', function(req, res) {
            res.send('response');
          });

          return request(app).get('/');
        }

        it('reduces the risk of XSS attacks', function(done) {
          checkHeaders()
            .expect('x-xss-protection', /^1/)
            .expect('x-xss-protection', /mode=block/)
            .end(done);
        });

        it('omits the powered-by header', function(done) {
          checkHeaders()
            .expect(function(res) {
              if (res.headers['x-powered-by']) {
                throw new Error('powered-by header present');
              }
            })
            .end(done);
        });

        it('prevents frame embedding', function(done) {
          checkHeaders().expect('x-frame-options', 'DENY').end(done);
        });

        it('disables content-type sniffing', function(done) {
          checkHeaders().expect('x-content-type-options', 'nosniff').end(done);
        });

        it('disables client-side caching', function(done) {
          checkHeaders()
            .expect('cache-control', /no-store/)
            .expect('cache-control', /no-cache/)
            .expect('cache-control', /must-revalidate/)
            .expect('expires', '0')
            .expect('pragma', 'no-cache')
            .end(done);
        });

      });

    });

  });

});
