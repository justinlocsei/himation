'use strict';

var Promise = require('bluebird');
var request = require('request');

var errors = require('himation/core/errors');
var urls = require('himation/core/urls');

/**
 * A Chiton API client
 *
 * @param {string} endpoint The URL for the root API endpoint
 * @param {string} token The token used to authenticate API requests
 */
function Client(endpoint, token) {
  this.endpoint = endpoint;
  this.token = token;
}

/**
 * Request recommendations for a wardrobe profile
 *
 * @param {object} profile Serialized profile data
 * @returns {Promise} The pending request
 * @fulfill {object} The generated recommendation data
 * @reject {Error} A request or parsing error
 */
Client.prototype.requestRecommendations = function(profile) {
  var endpoint = this.endpoint;
  var token = this.token;

  return new Promise(function(resolve, reject) {
    request({
      url: urls.joinPaths(endpoint, 'recommendations'),
      method: 'POST',
      form: profile,
      headers: {
        'Authorization': 'Token ' + token
      }
    }, function(error, response, body) {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(new errors.DataError('Unknown API error: ' + body + ' (' + response.statuCode + ')'));
      }
    });
  });
};

/**
 * Establish a connection with the Chiton API
 *
 * @param {string} endpoint The URL for the root API endpoint
 * @param {string} token The token used to authenticate API requests
 * @returns {Client} An API client
 */
function connect(endpoint, token) {
  if (!endpoint) {
    throw new errors.ConfigurationError('You must provide the root API endpoint');
  }

  if (!token) {
    throw new errors.ConfigurationError('You must provide the API token');
  }

  return new Client(endpoint, token);
}

module.exports = {
  connect: connect
};
