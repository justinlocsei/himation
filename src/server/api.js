'use strict';

var Promise = require('bluebird');
var request = require('request');

var errors = require('himation/core/errors');
var urls = require('himation/core/urls');

/**
 * Convert a survey state shape to data that can be submitted to the API
 *
 * @param {object} data A survey state shape
 * @returns {object} A payload for an API recommendations request
 */
function packageSurvey(data) {
  var careTypes = data.careTypes
    .filter(careType => careType.isSelected)
    .map(careType => careType.slug);

  var expectations = data.formalities.map(function(formality) {
    return {
      formality: formality.slug,
      frequency: formality.frequency
    };
  });

  var sizes = data.sizes
    .filter(size => size.isSelected)
    .map(size => size.slug);

  var styles = data.styles
    .filter(style => style.isSelected)
    .map(style => style.slug);

  return {
    'avoid_care': careTypes,
    'birth_year': data.birthYear,
    'body_shape': data.bodyShape,
    'expectations': expectations,
    'sizes': sizes,
    'styles': styles
  };
}

/**
 * A Chiton API client
 *
 * @param {string} endpoint The URL for the root API endpoint
 * @param {string} token The token used to authenticate API requests
 */
function ApiClient(endpoint, token) {
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
ApiClient.prototype.requestRecommendations = function(profile) {
  var endpoint = this.endpoint;
  var token = this.token;

  return new Promise(function(resolve, reject) {
    request({
      url: urls.relativeToAbsolute('recommendations', endpoint) + '/',
      method: 'POST',
      body: profile,
      json: true,
      headers: {
        'Authorization': 'Token ' + token
      }
    }, function(error, response, body) {
      var fieldErrors;

      if (error) {
        reject(new errors.DataError('Request error: ' + error));
      } else if (response.statusCode === 200) {
        resolve(body);
      } else if (response.statusCode === 400) {
        fieldErrors = Object.keys(body.errors).reduce(function(previous, field) {
          previous.push(field + ': ' + body.errors[field]);
          return previous;
        }, []);

        reject(new errors.DataError('API error: ' + fieldErrors.join(' | ')));
      } else {
        reject(new errors.DataError('Unknown error: ' + response.statusCode));
      }
    });
  });
};

/**
 * Create a Chiton API client
 *
 * @param {string} endpoint The URL for the root API endpoint
 * @param {string} token The token used to authenticate API requests
 * @returns {ApiClient} An API client
 */
function createApiClient(endpoint, token) {
  if (!endpoint) {
    throw new errors.ConfigurationError('You must provide the root API endpoint');
  }

  if (!token) {
    throw new errors.ConfigurationError('You must provide the API token');
  }

  return new ApiClient(endpoint, token);
}

module.exports = {
  createApiClient: createApiClient,
  packageSurvey: packageSurvey
};
