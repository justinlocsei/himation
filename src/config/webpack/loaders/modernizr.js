'use strict';

var modernizr = require('modernizr');

/**
 * Produce source for a custom Modernizr build using a Modernizr config file
 *
 * @param {string} modernizrRc The text of a .modernizrrc file
 */
function modernizrLoader(modernizrRc) {
  this.cacheable();

  var callback = this.async();

  modernizr.build(JSON.parse(modernizrRc), function(output) {
    callback(null, output);
  });
}

module.exports = modernizrLoader;
