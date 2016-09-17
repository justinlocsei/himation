'use strict';

var sortBy = require('lodash/sortBy');

var data = require('himation/email/data');
var Email = require('himation/email/email');
var errors = require('himation/core/errors');

// Load all known emails
//
// This uses explicit requires for each email to allow webpack to easily analyze
// the dependencies for this file.
var EMAILS = {
  welcome: require('himation/email/emails/welcome')
};
var DEFINITIONS = Object.keys(EMAILS).reduce(function(definitions, slug) {
  definitions[slug] = new data.EmailDefinition(EMAILS[slug]);
  return definitions;
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
  var definition = DEFINITIONS[slug];
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
  var emails = Object.keys(DEFINITIONS).map(slug => new Email(slug, DEFINITIONS[slug], settings));
  return sortBy(emails, email => email.name);
}

module.exports = {
  createEmail: createEmail,
  getAll: getAll
};
