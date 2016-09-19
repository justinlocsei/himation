'use strict';

var fs = require('fs');

var errors = require('himation/core/errors');
var paths = require('himation/core/paths');
var settings = require('himation/config/settings');

/**
 * Load the current environment's settings from a JSON file
 *
 * @param {string} file The path to the settings file
 * @returns {HimationSettings}
 * @throws {ConfigurationError} If the environment cannot be loaded
 */
function load(file) {
  var contents, config;

  var settingsFile = file || paths.resolve().settings;
  try {
    contents = fs.readFileSync(settingsFile);
  } catch (e) {
    throw new errors.ConfigurationError('Could not load the settings file at "' + settingsFile + '": ' + e.message);
  }

  try {
    config = JSON.parse(contents);
  } catch (e) {
    throw new errors.ConfigurationError('Could not parse the settings file: ' + e.message);
  }

  return settings.build(config);
}

module.exports = {
  load: load
};
