'use strict';

var nunjucks = require('nunjucks');

/**
 * Create a new Nunjucks template environment
 *
 * @param {string} templatePath The path to the templates directory
 * @returns {nunjucks.Environment} A nunjucks environment
 */
function createNunjucksEnvironment(templatePath) {
  var loader = new nunjucks.FileSystemLoader(templatePath);

  return new nunjucks.Environment(loader, {
    autoescape: true,
    lstripBlocks: true,
    trimBlocks: true
  });
}

module.exports = {
  createNunjucksEnvironment: createNunjucksEnvironment
};
