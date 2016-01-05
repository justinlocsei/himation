'use strict';

/**
 * An error thrown when the Chiton configuration is incorrect
 *
 * @param {string} message The description of the configuration error
 */
function ConfigurationError(message) {
  Error.call(this);
  Error.captureStackTrace(this, ConfigurationError);
  this.message = message;
  this.name = 'ConfigurationError';
}

ConfigurationError.prototype = Object.create(Error.prototype);

module.exports = ConfigurationError;
