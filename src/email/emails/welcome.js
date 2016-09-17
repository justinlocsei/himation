'use strict';

var emails = require('himation/email/emails');

var WelcomeEmail = emails.defineEmail({

  campaignName: 'Welcome',
  name: 'Welcome',

  getRecipientTags: function() {
    return ['welcome'];
  },

  getSubject: function() {
    return 'Welcome to Cover Your Basics';
  }

});

module.exports = WelcomeEmail;
