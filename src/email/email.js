'use strict';

var extend = require('extend');
var path = require('path');
var nunjucks = require('nunjucks');

var data = require('himation/email/data');
var paths = require('himation/core/paths').resolve();

var CONTENT_TYPES = [
  {key: 'html', extension: 'html'},
  {key: 'text', extension: 'txt'}
];

/**
 * A class for sending a particular type of email
 *
 * @typedef {HimationEmail}
 * @property {string} name The email's name
 * @property {string} slug The email's slug
 * @param {string} slug The slug for the email
 * @param {HimationEmailDefinition} definition The definition for the email
 */
function Email(slug, definition) {
  this.slug = slug;
  this.definition = definition;

  this.name = definition.name;
}

/**
 * Render a batch of emails
 *
 * @param {ApiClient} apiClient An API client from which to gather sending information
 * @param {object} options Options for rendering
 * @param {function} options.onRender A function that will receive a single rendered email
 * @param {number} [options.rangeEnd] The index of the last recipient to render
 * @param {number} [options.rangeStart] The index of the first recipient to render
 */
Email.prototype.batchRender = function(apiClient, options) {
  var settings = extend({
    onRender: null,
    rangeEnd: undefined,
    rangeStart: undefined
  }, options || {});

  var recipients = this.definition
    .getRecipients(apiClient)
    .slice(settings.rangeStart, settings.rangeEnd);

  var context = this.definition.getContext(apiClient) || {};

  recipients.forEach(recipient => {
    var rendered = this._render(recipient, context);
    options.onRender(rendered);
  });
};

/**
 * Render the email
 *
 * @param {HimationEmailRecipient} recipient The recipient of the email
 * @param {object} baseContext The base context for rendering the message
 * @returns {HimationRenderedEmail}
 * @private
 */
Email.prototype._render = function(recipient, baseContext) {
  var templateLoader = new nunjucks.FileSystemLoader(paths.email.templates);
  var templateRenderer = new nunjucks.Environment(templateLoader, {
    autoescape: true,
    throwOnUndefined: true
  });

  var subject = this.definition.getSubject(recipient);

  var recipientContext;
  if (this.definition.getRecipientContext) {
    recipientContext = this.definition.getRecipientContext();
  }

  var context = extend({
    __title: subject,
  }, baseContext, recipientContext || {});

  var email = {
    recipient: recipient.email,
    subject: subject
  };

  CONTENT_TYPES.forEach(contentType => {
    var template = path.join('emails', this.slug + '.' + contentType.extension);
    email[contentType.key] = templateRenderer.render(template, context);
  });

  return new data.RenderedEmail(email);
};

module.exports = Email;
