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
var files = require('himation/core/files');
var paths = require('himation/core/paths').resolve();
var random = require('himation/email/random');

// The base width of the email, in pixels
var EMAIL_WIDTH = 550;

// The placeholder tag for injecting non-inlined styles
var HEAD_STYLES_TAG = '{{ __headStyles }}';

/**
 * A class for sending a particular type of email
 *
 * @typedef {HimationEmail}
 * @property {string} name The email's name
 * @property {string} slug The email's slug
 * @param {string} slug The slug for the email
 * @param {HimationEmailDefinition} definition The definition for the email
 * @param {HimationSettings} settings The current environment's settings
 */
function Email(slug, definition, settings) {
  this.slug = slug;
  this.definition = definition;
  this.settings = settings;

  this.name = definition.name;
  this._apiClient = api.createApiClient(settings.chiton.endpoint, settings.chiton.token);
}

/**
 * The tag used by SendGrid to inject the unsubscribe links
 *
 * @type {string}
 */
Email.UNSUBSCRIBE_TAG = '[unsubscribeUrl]';

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

  var recipients = this.definition
    .getRecipients(this._apiClient)
    .slice(settings.rangeStart, settings.rangeEnd);

  var contexts = this.definition.mapRecipientsToContext(recipients, this._apiClient);

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
  var recipientContext = this.definition.mapRecipientsToContext([recipient], this._apiClient)[0];
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
    tags: this.definition.getRecipientTags(recipient)
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
  var subject = this.definition.getSubject(recipient);

  return {
    __gaQueryString: this._buildGoogleAnalyticsQueryString(subject),
    __siteUrl: this.settings.servers.app.publicUrl,
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
  var data = {
    tid: this.settings.googleAnalyticsId,
    cid: random.randInt32() + '.' + random.randInt32(),
    t: 'event',
    ec: 'email',
    ea: 'open',
    dt: subject
  };

  if (this.definition.campaignName) {
    data.cm = 'email';
    data.cn = this.definition.campaignName;
  }

  return querystring.stringify(data);
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
