'use strict';

/**
 * An error thrown when incorrect data is sent or received
 *
 * @param {string} message The description of the data error
 */
function DataError(message) {
  Error.call(this);
  Error.captureStackTrace(this, DataError);
  this.message = message;
  this.name = 'DataError';
}

DataError.prototype = Object.create(Error.prototype);

module.exports = DataError;
