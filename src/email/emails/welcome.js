'use strict';

var defineEmail = require('himation/email/define-email');

var WelcomeEmail = defineEmail({

  name: 'Welcome',

  getRecipients: function() {
    return [
      {email: 'alpha@example.com'},
      {email: 'beta@example.com'}
    ];
  },

  getSubject: function() {
    return 'Welcome to Cover Your Basics';
  },

  getContext: function() {
    return {};
  }

});

module.exports = WelcomeEmail;
