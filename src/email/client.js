'use strict';

var sendgrid = require('sendgrid');

var Email = require('himation/email/email');

/**
 * Create a client for sending email through the SendGrid API
 *
 * @param {HimationSettings} settings Settings for the current environment
 */
function Client(settings) {
  this.settings = settings;
}

/**
 * Send a single email
 *
 * @param {HimationRenderedEmail} email A rendered email
 * @returns {Promise} The result of sending the email
 * @fulfill When the email is sent
 * @reject When the email cannot be sent
 */
Client.prototype.sendEmail = function(email) {
  var payload = {
    'personalizations': [{
      'to': [{
        'email': email.recipient
      }]
    }],
    'subject': email.subject,
    'from': {
      'email': this.settings.emailSenderAddress,
      'name': this.settings.emailSenderName
    },
    'content': [
      {
        'type': 'text/plain',
        'value': email.text
      },
      {
        'type': 'text/html',
        'value': email.html
      }
    ],
    'categories': email.tags,
    'tracking_settings': {
      'click_tracking': {
        'enable': true,
        'enable_text': false
      },
      'open_tracking': {
        'enable': true
      },
      'subscription_tracking': {
        'enable': true,
        'substitution_tag': Email.UNSUBSCRIBE_TAG
      }
    }
  };

  var api = this._getConnection();
  var request = api.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: payload
  });

  return api.API(request); // eslint-disable-line new-cap
};

/**
 * Get a connection to the SendGrid API
 *
 * @returns {sendgrid}
 */
Client.prototype._getConnection = function() {
  if (this._api) { return this._api; }

  var api = sendgrid(this.settings.sendgridApiKey);
  this._api = api;

  return api;
};

module.exports = Client;
