'use strict'

var nj = require('nunjucks');

/**
 * Create a new nunjucks template engine
 *
 * @param {string} templates The path to the templates directory
 * @returns {nunjucks.Environment} A nunjucks environment
 */
function nunjucks(templates) {
  var loader = new nj.FileSystemLoader(templates);

  return new nj.Environment(loader, {
    autoescape: true,
    lstripBlocks: true,
    trimBlocks: true
  });
}

module.exports = {
  nunjucks: nunjucks
};
