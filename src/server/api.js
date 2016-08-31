'use strict';

var extend = require('extend');
var isString = require('lodash/isString');
var Promise = require('bluebird');
var request = require('request');
var sortBy = require('lodash/sortBy');

var errors = require('himation/core/errors');
var urls = require('himation/core/urls');

/**
 * Convert a survey state shape to data that can be submitted to the API
 *
 * @param {HimationSurveyData} data A survey state shape
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
 * Convert API recommendations into a simplified data shape
 *
 * @param {object} original The raw API response
 * @returns {object} The simplified recommendations
 * @private
 */
function simplifyRecommendations(original) {
  original.basics.forEach(function(basic) {
    basic.garments.forEach(function(garment, index) {
      var offering = sortBy(garment.purchase_options, po => po.price)[0];

      basic.garments[index] = {
        brand: garment.garment.brand,
        brandedName: garment.garment.branded_name,
        care: garment.garment.care,
        id: garment.garment.id,
        images: offering.images,
        name: garment.garment.name,
        price: offering.price,
        retailer: offering.retailer,
        url: offering.url,
        weight: garment.weight
      };
    });
  });

  return original;
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
 * @param {object} [options] Options for requesting recommendations
 * @param {string} [options.ip] The IP address of the requester to send to the API
 * @returns {Promise} The pending request
 * @fulfill {object} The generated recommendation data
 * @reject {Error} A request or parsing error
 */
ApiClient.prototype.requestRecommendations = function(profile, options) {
  var settings = extend({
    ip: null
  }, options || {});

  var endpoint = this.endpoint;
  var token = this.token;

  return new Promise(function(resolve, reject) {
    request({
      url: urls.relativeToAbsolute('recommendations', endpoint) + '/',
      method: 'POST',
      body: extend({}, profile, {
        'client_ip_address': settings.ip,
        'max_garments_per_group': 2
      }),
      json: true,
      headers: {
        'Authorization': 'Token ' + token
      }
    }, function(error, response, body) {
      var errorMessage;

      if (error) {
        reject(new errors.DataError('Request error: ' + error));
      } else if (response.statusCode === 200) {
        resolve(simplifyRecommendations(body));
      } else if (response.statusCode === 400) {
        if (isString(body)) {
          errorMessage = body;
        } else if (body.errors && body.errors.fields) {
          errorMessage = Object.keys(body.errors.fields).reduce(function(previous, field) {
            previous.push(field + ': ' + body.errors.fields[field]);
            return previous;
          }, []).join(' | ');
        } else if (body.errors && body.errors.server) {
          errorMessage = body.errors.server;
        } else {
          errorMessage = 'Unknown error';
        }

        reject(new errors.DataError('API error: ' + errorMessage));
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
