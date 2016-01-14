'use strict';

/**
 * An error thrown when the Himation build is incorrect
 *
 * @param {string} message The description of the build error
 */
function BuildError(message) {
  Error.call(this);
  Error.captureStackTrace(this, BuildError);
  this.message = message;
  this.name = 'BuildError';
}

BuildError.prototype = Object.create(Error.prototype);

module.exports = BuildError;
