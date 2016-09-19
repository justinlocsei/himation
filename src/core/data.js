'use strict';

var Joi = require('joi');

var errors = require('himation/core/errors');

/**
 * Create a schema validator
 *
 * @param {object} schema A Joi object schema
 * @returns {function} A function that validates and creates an object
 */
function createValidator(schema) {
  var fullSchema = Joi.object().keys(schema).default();

  return function validator(data) {
    var validation = Joi.validate(data, fullSchema, {convert: false});
    if (validation.error) {
      throw new errors.DataError(validation.error.annotate());
    }

    return validation.value;
  };
}

module.exports = {
  createValidator: createValidator
};
