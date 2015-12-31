'use strict';

var util = require('util');

/**
 * Create a new error subclass
 *
 * @param {Error} [parent] The optional parent error class to use
 * @returns {Error}
 */
function subclass(parent) {
  var Parent = parent || Error;

  function CustomError(message) {
    Parent.call(this);
    this.message = message;
  }

  util.inherits(CustomError, Parent);

  return CustomError;
}

module.exports = {
  subclass: subclass
};
