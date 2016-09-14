'use strict';

var data = require('himation/email/data');

/**
 * Define and validate an email
 *
 * @param {object} definition The definition of the email
 * @returns {HimationEmailDefinition} A Himation email definition
 */
function defineEmail(definition) {
  return new data.EmailDefinition(definition);
}

module.exports = defineEmail;
