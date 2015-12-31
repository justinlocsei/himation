'use strict';

var errors = require('chiton/core/errors');
var settings = require('chiton/config/settings');

var EnvironmentError = errors.subclass();

// All known environment names
var names = ['development', 'production'];

/**
 * Determine if an environment is valid
 *
 * @param {string} environment The name of an enviornment
 * @returns {boolean}
 * @private
 */
function isValid(environment) {
  return names.indexOf(environment) !== -1;
}

/**
 * Load the settings for a given environment
 *
 * @param {string} [environment] The name of an environment
 * @returns {ChitonSettings}
 * @throws {EnvironmentError} If the environment is invalid
 */
function load(environment) {
  var name = environment || 'development';

  if (!isValid(name)) {
    throw new EnvironmentError('"' + name + '" is not a valid environment (Choices are: ' + names.join(', ') + ')');
  }

  var config = require('chiton/config/environments/' + name);
  return settings.customize(config);
}

module.exports = {
  EnvironmentError: EnvironmentError,
  load: load
};
