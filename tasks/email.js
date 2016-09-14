'use strict';

var gutil = require('gulp-util');

var PreviewServer = require('himation/email/preview-server');
var settings = require('./settings');

function preview(done) {
  var server = new PreviewServer(settings);

  server.start()
    .then(function() {
      gutil.log('Email preview server available');
      done();
    })
    .catch(function(err) {
      throw new gutil.PluginError('Could not start the email server', err);
    });
}

module.exports = {
  preview: preview
};
