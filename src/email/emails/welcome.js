'use strict';

var emails = require('himation/email/emails');

var Welcome = emails.defineEmail({
  campaignName: 'Welcome',
  name: 'Welcome',
  slug: 'welcome',

  getRecipientTags: function() {
    return ['welcome'];
  },

  getSubject: function() {
    return 'You’re In!';
  }
});

module.exports = Welcome;
