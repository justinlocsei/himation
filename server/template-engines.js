'use strict';

var nj = require('nunjucks');

/**
 * Create a new nunjucks template engine
 *
 * @param {string} templatePath The path to the templates directory
 * @returns {nunjucks.Environment} A nunjucks environment
 */
function nunjucks(templatePath) {
  var loader = new nj.FileSystemLoader(templatePath);

  return new nj.Environment(loader, {
    autoescape: true,
    lstripBlocks: true,
    trimBlocks: true
  });
}

module.exports = {
  nunjucks: nunjucks
};
