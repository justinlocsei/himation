'use strict';

var yargs = require('yargs');

var environments = require('chiton/config/environments');

/**
 * Parse all comment-line otions
 *
 * @returns {object} The parsed arguments
 */
function args() {
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
  args: args
};
