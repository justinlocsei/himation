'use strict';

var fs = require('fs');
var path = require('path');
var sortBy = require('lodash/sortBy');

var data = require('himation/email/data');
var Email = require('himation/email/email');
var errors = require('himation/core/errors');
var paths = require('himation/core/paths').resolve();

var LOADED = false;
var EMAILS = {};

/**
 * Define and validate an email
 *
 * @param {object} definition The definition of the email
 * @returns {HimationEmailDefinition} A Himation email definition
 */
function defineEmail(definition) {
  return new data.EmailDefinition(definition);
}

/**
 * Load all email definitions
 *
 * @private
 */
function loadAll() {
  if (LOADED) { return; }

  var emailsDir = path.join(paths.email.root, 'emails');

  fs.readdirSync(emailsDir).forEach(function(file) {
    var slug = file.replace(/\.js$/, '');
    var definition = require(path.join(emailsDir, file));

    EMAILS[slug] = new data.EmailDefinition(definition);
  });

  LOADED = true;
}

/**
 * Create a new email class when given a slug
 *
 * @param {string} slug An email slug
 * @param {HimationSettings} settings The current environment's settings
 * @returns {HimationEmail}
 * @throws {DataError} If no email with the slug exists
 */
function createEmail(slug, settings) {
  loadAll();

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
  loadAll();

  var emails = Object.keys(EMAILS).map(slug => new Email(slug, EMAILS[slug], settings));
  return sortBy(emails, email => email.name);
}

module.exports = {
  createEmail: createEmail,
  defineEmail: defineEmail,
  getAll: getAll
};
