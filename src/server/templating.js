'use strict';

var nunjucks = require('nunjucks');

/**
 * Create a new template engine that can be used by an Express app
 *
 * @param {string} templatePath The path to the templates directory
 * @returns {nunjucks.Environment} A nunjucks environment
 */
function createEngine(templatePath) {
  var loader = new nunjucks.FileSystemLoader(templatePath);

  return new nunjucks.Environment(loader, {
    autoescape: true,
    lstripBlocks: true,
    trimBlocks: true
  });
}

module.exports = {
  createEngine: createEngine
};
