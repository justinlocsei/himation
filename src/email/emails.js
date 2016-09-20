'use strict';

var extend = require('extend');
var glob = require('glob');
var path = require('path');
var sortBy = require('lodash/sortBy');

var BaseEmail = require('himation/email/email');
var data = require('himation/email/data');
var errors = require('himation/core/errors');

/**
 * Load all email definitions
 *
 * @returns {HimationEmail[]}
 * @private
 */
function loadAll() {
  var findEmails = path.join(__dirname, 'emails', '*.js');
  return glob.sync(findEmails).map(require);
}

/**
 * Define an email template
 *
 * @param {object} schema The definition for the template
 * @returns {HimationEmail} A new email subclass
 */
function defineEmail(schema) {
  var definition = new data.EmailDefinition(schema);

  function Email() { BaseEmail.call(this, arguments); }

  Email.prototype = Object.create(BaseEmail.prototype);
  extend(Email.prototype, definition);

  Email.displayName = definition.name;
  Email.slug = definition.slug;

  return Email;
}

/**
 * Create a new email class when given a slug
 *
 * @param {string} slug An email slug
 * @returns {HimationEmail}
 * @throws {DataError} If no email with the slug exists
 */
function createEmail(slug) {
  var EmailClass = loadAll().find(email => email.slug === slug);
  if (!EmailClass) {
    throw new errors.DataError('No email with a slug of ' + slug + ' was found');
  }

  return new EmailClass();
}

/**
 * Get all registered emails classes, sorted by name
 *
 * @returns {HimationEmail[]}
 */
function getAll() {
  return sortBy(loadAll(), email => email.displayName);
}

module.exports = {
  createEmail: createEmail,
  defineEmail: defineEmail,
  getAll: getAll
};
