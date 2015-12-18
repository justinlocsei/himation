'use strict';

var _ = require('lodash');

// The names of all known environments
var IDS = {
  development: 'development',
  production: 'production'
};
var NAMES = _.values(IDS);

/**
 * Determine if an environment is known
 *
 * @param {string} environment The name of an enviornment
 * @returns {boolean}
 * @private
 */
function isKnown(environment) {
  return NAMES.indexOf(environment) !== -1;
}

/**
 * Validate a list of environments
 *
 * @param {string[]} environments The names of environments
 * @throws If any of the environments is unknown
 */
function validate(environments) {
  var unknown = environments.filter(function(environment) {
    return !isKnown(environment);
  });
  unknown.sort();

  if (unknown.length > 1) {
    throw new Error('"' + unknown.join(', ') + '" are unknown environments');
  } else if (unknown.length === 1) {
    throw new Error('"' + unknown[0] + '" is an unknown environment');
  }
}

/**
 * Produce a configuration tailored to a given environment
 *
 * @param {string} current The name of an environment
 * @param {Object} configurations A map of environment names to values or functions that produce a value
 * @param {*} [fallback] The value to return when no configuration matches the environment
 * @returns {*} The coniguration value for the given environment
 * @throws If the given environment is unknown
 * @throws If any of the configuration environments is unknown
 * @throws If no fallback is provided and no configuration matches the environment
 */
function tailor(current, configurations, fallback) {
  validate([current].concat(Object.keys(configurations)));

  var configuration = configurations[current];
  if (_.isFunction(configuration)) {
    return configuration();
  } else if (!_.isUndefined(configuration)) {
    return configuration;
  }

  if (_.isUndefined(fallback)) {
    throw new Error('No configuration was defined for the "' + current + '" environment');
  } else {
    return fallback;
  }
}

module.exports = {
  default: IDS.development,
  known: NAMES,
  tailor: tailor
};
