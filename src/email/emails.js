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
 * Resolve an email slug to an email class
 *
 * @param {string} slug An email slug
 * @returns {HimationEmailDefinition}
 * @throws {DataError} If no email with the slug exists
 */
function findDefinitionBySlug(slug) {
  loadAll();

  var definition = EMAILS[slug];
  if (!definition) {
    throw new errors.DataError('No email with a slug of ' + slug + ' was found');
  } else {
    return definition;
  }
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
  findDefinitionBySlug: findDefinitionBySlug,
  getAll: getAll
};
