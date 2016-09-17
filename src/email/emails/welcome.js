'use strict';

var welcome = {
  campaignName: 'Welcome',
  name: 'Welcome',

  getRecipientTags: function() {
    return ['welcome'];
  },

  getSubject: function() {
    return 'Welcome to Cover Your Basics';
  }
};

module.exports = welcome;
