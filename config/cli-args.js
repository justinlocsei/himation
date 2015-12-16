'use strict';

var _ = require('lodash');
var yargs = require('yargs');

var environments = require('./environments');

/**
 * Parse all comment-line otions
 *
 * @returns {Object} The parsed arguments
 */
function parse() {
  var options = {
    environment: process.env.CHITON_ENV
  };

  var parsed = yargs
    .option('environment', {
      alias: 'e',
      default: environments.default,
      describe: 'Set the target environment',
      choices: environments.known,
      type: 'string'
    }).argv;

  return _.extend(options, parsed);
}

module.exports = {
  parse: parse
};
