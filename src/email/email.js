'use strict';

var extend = require('extend');
var htmlMinify = require('html-minifier');
var path = require('path');
var juice = require('juice');
var nunjucks = require('nunjucks');
var querystring = require('querystring');
var sass = require('node-sass');

var api = require('himation/server/api');
var data = require('himation/email/data');
var environment = require('himation/config/environment');
var files = require('himation/core/files');
var paths = require('himation/core/paths');
var random = require('himation/email/random');

// The base width of the email, in pixels
var EMAIL_WIDTH = 550;

// The placeholder tag for injecting non-inlined styles
var HEAD_STYLES_TAG = '{{ __headStyles }}';

/**
 * A class for sending a particular type of email
 *
 * @typedef {HimationEmail}
 */
function Email() {
  this._settings = environment.load();
  this._apiClient = api.createApiClient(this._settings.chiton.endpoint, this._settings.chiton.token);
}

/**
 * The tag used by SendGrid to inject the unsubscribe links
 *
 * @type {string}
 */
Email.UNSUBSCRIBE_TAG = '[unsubscribeUrl]';

/**
 * The name of the email
 *
 * @type {string}
 * @abstract
 */
Email.prototype.name = null;

/**
 * The slug of the email
 *
 * @type {string}
 * @abstract
 */
Email.prototype.slug = null;

/**
 * The campaign name of the email
 *
 * @type {string}
 * @abstract
 */
Email.prototype.campaignName = null;

/**
 * Get the recipients of the email
 *
 * @returns {HimationEmailRecipient[]}
 * @abstract
 */
Email.prototype.getRecipients = function() {
  return [];
};

/**
 * Get the tags to associate with a recipient
 *
 * @param {HimationEmailRecipient} recipient An email recipient
 * @returns {string[]}
 * @abstract
 */
Email.prototype.getRecipientTags = function() {
  return [];
};

/**
 * Get the subject of an email to a recipient
 *
 * @param {HimationEmailRecipient} recipient An email recipient
 * @returns {string}
 * @abstract
 */
Email.prototype.getSubject = function() {
  return [];
};

/**
 * Return a rendering context for each recipient in a list
 *
 * @param {HimationEmailRecipient[]} recipients A list of email recipients
 * @returns {object[]}
 * @abstract
 */
Email.prototype.mapRecipientsToContexts = function(recipients) {
  return recipients.map(() => {});
};

/**
 * Render a batch of emails
 *
 * @param {object} options Options for rendering
 * @param {function} options.onRender A function that will receive a single rendered email
 * @param {number} [options.rangeEnd] The index of the last recipient to render
 * @param {number} [options.rangeStart] The index of the first recipient to render
 */
Email.prototype.batchRender = function(options) {
  var settings = extend({
    onRender: null,
    rangeEnd: undefined,
    rangeStart: undefined
  }, options || {});

  var recipients = this
    .getRecipients(this._apiClient)
    .slice(settings.rangeStart, settings.rangeEnd);

  var contexts = this.mapRecipientsToContexts(recipients, this._apiClient);

  recipients.forEach((recipient, index) => {
    var rendered = this.render(recipient, contexts[index]);
    options.onRender(rendered);
  });
};

/**
 * Render the email
 *
 * @param {HimationEmailRecipient} recipient The recipient of the email
 * @param {object} [context] The base context for rendering the message
 * @returns {HimationRenderedEmail}
 */
Email.prototype.render = function(recipient, context) {
  var recipientContext = this.mapRecipientsToContexts([recipient], this._apiClient)[0];
  var messageContext = extend({}, context, recipientContext);

  return this._render(recipient, messageContext);
};

/**
 * Render an email
 *
 * @param {HimationEmailRecipient} recipient The recipient of the email
 * @param {object} messageContext The context for rendering the message
 * @returns {HimationRenderedEmail}
 */
Email.prototype._render = function(recipient, messageContext) {
  var templateLoader = new nunjucks.FileSystemLoader(paths.email.templates);
  var templateRenderer = new nunjucks.Environment(templateLoader, {
    autoescape: true,
    throwOnUndefined: true
  });

  var context = extend({}, messageContext, this._getBaseContext());

  return new data.RenderedEmail({
    html: this._renderHtml(templateRenderer, context),
    recipient: recipient.email,
    subject: context.__title,
    text: this._renderText(templateRenderer, context),
    tags: this.getRecipientTags(recipient)
  });
};

/**
 * Render the text version of the email
 *
 * @param {nunjucks.Environment} renderer A template renderer
 * @param {object} context The rendering context
 * @returns {string}
 */
Email.prototype._renderText = function(renderer, context) {
  var templatePaths = this._getTemplates('email.txt');

  return renderer.render(templatePaths.base, extend({
    __content: renderer.render(templatePaths.email, context)
  }, context));
};

/**
 * Render the HTML version of the email
 *
 * @param {nunjucks.Environment} renderer A template renderer
 * @param {object} context The rendering context
 * @returns {string}
 */
Email.prototype._renderHtml = function(renderer, context) {
  var templatePaths = this._getTemplates('email.html');
  var headStyles = this._renderStyles('styles.scss', renderer, context);
  var inlineStyles = this._renderStyles('inline-styles.scss', renderer, context);

  var html = renderer.render(templatePaths.base, extend({
    __content: renderer.render(templatePaths.email, context),
    __headStylesTag: HEAD_STYLES_TAG,
    __inlineStyles: inlineStyles
  }, context));

  var inlined = juice(html, {xmlMode: true});
  var styled = inlined.replace(
    HEAD_STYLES_TAG,
    '<style type="text/css">' + headStyles + '</style>'
  );

  return htmlMinify.minify(styled, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    html5: false,
    keepClosingSlash: true,
    minifyCSS: true,
    sortAttributes: true,
    sortClassName: true
  });
};

/**
 * Get the context required for rendering the base template
 *
 * @param {HimationEmailRecipient} recipient The recipient of the email
 * @returns {object}
 */
Email.prototype._getBaseContext = function(recipient) {
  var subject = this.getSubject(recipient);

  return {
    __gaQueryString: this._buildGoogleAnalyticsQueryString(subject),
    __siteUrl: this._settings.servers.app.publicUrl,
    __title: subject,
    __unsubscribeTag: Email.UNSUBSCRIBE_TAG,
    __width: EMAIL_WIDTH
  };
};

/**
 * Produce the query string used by Google Analytics for email tracking
 *
 * @param {string} subject The subject of the email
 * @returns {string}
 */
Email.prototype._buildGoogleAnalyticsQueryString = function(subject) {
  var query = {
    tid: this._settings.googleAnalyticsId,
    cid: random.randInt32() + '.' + random.randInt32(),
    t: 'event',
    ec: 'email',
    ea: 'open',
    dt: subject
  };

  if (this.campaignName) {
    query.cm = 'email';
    query.cn = this.campaignName;
  }

  return querystring.stringify(query);
};

/**
 * Get the paths to the templates for the current email
 *
 * This returns an object with the path to the base template and the template
 * for the current email type.
 *
 * @param {string} filename The template's file name
 * @returns {object}
 */
Email.prototype._getTemplates = function(filename) {
  var forEmailRelative = path.join('emails', this.slug, filename);
  var forEmailAbsolute = path.join(paths.email.templates, forEmailRelative);

  return {
    base: path.join('emails', 'base', filename),
    email: files.isFile(forEmailAbsolute) ? forEmailRelative : null
  };
};

/**
 * Render combined base/email styles from a named Sass file
 *
 * @param {string} name The name of the Sass file to render
 * @param {nunjucks.Environment} renderer A template renderer
 * @param {object} context The rendering context
 * @returns {string}
 */
Email.prototype._renderStyles = function(name, renderer, context) {
  var sassPaths = this._getTemplates(name);

  var extraStyles = '';
  if (sassPaths.email) {
    extraStyles = sass.renderSync({
      data: renderer.render(sassPaths.email, context)
    }).css.toString();
  }

  return sass.renderSync({
    data: renderer.render(sassPaths.base, extend({
      __extraStyles: extraStyles
    }, context))
  }).css.toString();
};

module.exports = Email;
