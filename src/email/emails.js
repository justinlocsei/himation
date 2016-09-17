'use strict';

var path = require('path');
var sortBy = require('lodash/sortBy');

var data = require('himation/email/data');
var Email = require('himation/email/email');
var errors = require('himation/core/errors');
var paths = require('himation/core/paths').resolve();

// Load all known emails
var EMAIL_SLUGS = ['welcome'];
var EMAILS = EMAIL_SLUGS.reduce(function(emails, slug) {
  var definition = require('himation/email/emails/' + slug);
  emails[slug] = new data.EmailDefinition(definition);

  return emails;
}, {});

/**
 * Create a new email class when given a slug
 *
 * @param {string} slug An email slug
 * @param {HimationSettings} settings The current environment's settings
 * @returns {HimationEmail}
 * @throws {DataError} If no email with the slug exists
 */
function createEmail(slug, settings) {
  var definition = EMAILS[slug];
  if (!definition) {
    throw new errors.DataError('No email with a slug of ' + slug + ' was found');
  }

  return new Email(slug, definition, settings);
}

/**
 * Get all registered emails, sorted by name
 *
 * @param {HimationSettings} settings The current environment's settings
 * @returns {HimationEmail[]}
 */
function getAll(settings) {
  var emails = Object.keys(EMAILS).map(slug => new Email(slug, EMAILS[slug], settings));
  return sortBy(emails, email => email.name);
}

module.exports = {
  createEmail: createEmail,
  getAll: getAll
};
