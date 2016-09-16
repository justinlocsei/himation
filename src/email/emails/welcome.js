'use strict';

var defineEmail = require('himation/email/define-email');

var WelcomeEmail = defineEmail({

  name: 'Welcome',

  getSubject: function() {
    return 'Welcome to Cover Your Basics';
  }

});

module.exports = WelcomeEmail;
