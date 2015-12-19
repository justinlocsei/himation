'use strict';

var yargs = require('yargs');

var environments = require('./environments');

/**
 * Parse all comment-line otions
 *
 * @returns {Object} The parsed arguments
 */
function parse() {
  return yargs
    .option('environment', {
      alias: 'e',
      default: process.env.CHITON_ENV || environments.default,
      describe: 'Set the target environment',
      choices: environments.names,
      type: 'string'
    }).argv;
}

module.exports = {
  parse: parse
};
