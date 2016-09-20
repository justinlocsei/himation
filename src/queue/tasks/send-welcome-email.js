'use strict';

var Client = require('himation/email/client');
var tasks = require('himation/queue/tasks');
var WelcomeEmail = require('himation/email/emails/welcome');

var SendWelcomeEmail = tasks.defineTask({

  slug: 'send-welcome-email',

  /**
   * Send a welcome email to a single user
   *
   * @param {string} to The email address of the recipient
   * @returns {Proimse} The results of sending the email
   */
  handle: function(to) {
    var welcomeEmail = new WelcomeEmail();
    var email = welcomeEmail.render({email: to});

    var client = new Client();
    return client.sendEmail(email);
  }

});

module.exports = SendWelcomeEmail;
