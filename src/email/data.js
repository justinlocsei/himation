'use strict';

var Joi = require('joi');

var errors = require('himation/core/errors');

/**
 * Create a schema validator
 *
 * @param {object} schema A Joi object schema
 * @returns {function} A function that validates and creates an object
 * @private
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

/**
 * A function to return an empty context for each recipient
 *
 * @param {HimationEmailRecipient[]} recipients The recipients of the email
 * @returns {object[]}
 * @private
 */
function emptyMapRecipientsToContext(recipients) {
  return recipients.map(function() {
    return {};
  });
}

/**
 * A function to return an empty recipient list
 *
 * @returns {object[]}
 * @private
 */
function emptyRecipients() {
  return [];
}

/**
 * A function to return an empty list of tags
 *
 * @returns {object[]}
 * @private
 */
function emptyTags() {
  return [];
}

/**
 * A Himation email recipient
 *
 * @typedef {object} HimationEmailRecipient
 * @property {string} email The recipient's email address
 */
var EmailRecipient = createValidator({
  email: Joi.string().required()
});

/**
 * A Himation email definition
 *
 * @typedef {object} HimationEmailDefinition
 * @property {string} [campaignName] The name of the email campaign
 * @property {function} [getRecipients] A function that returns a list of HimationEmailRecipient objects when given an ApiClient instance
 * @property {function} [getRecipientTags] A function that returns the tags to associate with an email to a HimationEmailRecipient
 * @property {function} getSubject A function that will provide the subject of the email when given a HimationEmailRecipient
 * @property {function} [mapRecipientsToContext] A function that maps HimationEmailRecipient instances and an API client to rendering contexts
 * @property {string} name The human-readable name of the email
 */
var EmailDefinition = createValidator({
  campaignName: Joi.string(),
  getRecipients: Joi.func().default(emptyRecipients),
  getRecipientTags: Joi.func().default(emptyTags),
  getSubject: Joi.func().required(),
  mapRecipientsToContext: Joi.func().default(emptyMapRecipientsToContext),
  name: Joi.string().required()
});

/**
 * A rendered Himation email
 *
 * @typedef {object} HimationRenderedEmail
 * @property {string} html The HTML version of the email
 * @property {string} recipient The recipient's email address
 * @property {string} subject The subject of the email
 * @property {string[]} [tags] Text tags to associate with the email
 * @property {string} text The text version of the email
 */
var RenderedEmail = createValidator({
  html: Joi.string().required(),
  recipient: Joi.string().required(),
  subject: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  text: Joi.string().required()
});

module.exports = {
  EmailDefinition: EmailDefinition,
  EmailRecipient: EmailRecipient,
  RenderedEmail: RenderedEmail
};
