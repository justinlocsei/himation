'use strict';

var emails = require('himation/email/emails');

var WelcomeEmail = emails.defineEmail({

  name: 'Welcome',

  getSubject: function() {
    return 'Welcome to Cover Your Basics';
  }

});

module.exports = WelcomeEmail;
