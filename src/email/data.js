'use strict';

var Joi = require('joi');

var data = require('himation/core/data');

/**
 * A Himation email recipient
 *
 * @typedef {object} HimationEmailRecipient
 * @property {string} email The recipient's email address
 */
var EmailRecipient = data.createValidator({
  email: Joi.string().required()
});

/**
 * A Himation email definition
 *
 * @typedef {object} HimationEmailDefinition
 * @property {string} [campaignName] The name of the email campaign
 * @property {function} [getRecipients] A function that returns a list of recipients
 * @property {function} [getRecipientTags] A function that returns tags for a recipient
 * @property {function} getSubject A function that will provide the subject of an email to a recipient
 * @property {function} [mapRecipientsToContexts] A function that maps each recipient to a rendering context
 * @property {string} name The human-readable name of the email
 * @property {string} slug The slug of the email
 */
var EmailDefinition = data.createValidator({
  campaignName: Joi.string(),
  getRecipients: Joi.func(),
  getRecipientTags: Joi.func(),
  getSubject: Joi.func().required(),
  mapRecipientsToContexts: Joi.func(),
  name: Joi.string().required(),
  slug: Joi.string().required()
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
var RenderedEmail = data.createValidator({
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
