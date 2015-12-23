'use strict';

// A mapping of environment IDs to names
var ids = {
  development: 'development',
  production: 'production'
};

// The string names of all known environments
var names = Object.keys(ids).map(function(id) { return ids[id]; }).sort();

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
 * @param {string} environment The name of an environment
 * @returns {ChitonSettings}
 * @throws If the environment is invalid
 */
function loadSettings(environment) {
  if (!isValid(environment)) {
    throw new Error('"' + environment + '" is not a valid environment (Choices are: ' + names.join(', ') + ')');
  }

  var settings = require('chiton/config/environments/' + environment);
  return settings.load();
}

module.exports = {
  default: ids.development,
  loadSettings: loadSettings,
  names: names
};
