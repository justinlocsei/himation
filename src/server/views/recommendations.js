'use strict';

var extend = require('extend');

var api = require('himation/server/api');
var settings = require('himation/core/settings');
var surveyData = require('himation/server/data/survey');

var defaultRegistrationPitchState = require('himation/ui/reducers/registration-pitch').defaultState;
var IndexPage = require('himation/ui/containers/pages').default;
var RecommendationsPage = require('himation/ui/containers/pages/recommendations').default;
var rendering = require('himation/ui/rendering');
var survey = require('himation/ui/components/survey');

/**
 * Render an invalid survey form
 *
 * @param {Response} res The server response
 * @param {HimationSurveyData} data The survey state shape
 * @param {object} errors Possible validation errors
 * @private
 */
function renderInvalidSurveyForm(res, data, errors) {
  rendering.prerenderPageComponent(res, IndexPage, {
    state: {
      survey: extend({}, data, {
        errors: errors,
        form: {
          failedValidation: true,
          isSubmitting: false
        }
      })
    },
    template: 'pages/home.html',
    context: {
      formIsInvalid: true
    }
  });
}

/**
 * Render recommendations for a survey
 *
 * @param {Response} res The server response
 * @param {function} next An Express next callback
 * @param {object} options Options for rendering the recommendations
 * @param {ApiClient} options.apiClient A himation API client
 * @param {string} options.ipAddress The IP address of the requester
 * @param {boolean} options.isRegistered Whether the user is registered
 * @param {HimationSurveyData} options.surveyData The survey data
 * @private
 */
function renderRecommendations(res, next, options) {
  options.apiClient.requestRecommendations(api.packageSurvey(options.surveyData), {ip: options.ipAddress})
    .then(function(recommendations) {
      rendering.prerenderPageComponent(res, RecommendationsPage, {
        state: {
          recommendations: recommendations,
          registrationPitch: extend({}, defaultRegistrationPitchState, {
            isBanished: options.isRegistered
          })
        },
        template: 'pages/recommendations.html'
      });
    })
    .catch(function(error) {
      next(error);
    });
}

module.exports = function renderResponse(req, res, next) {
  if (survey.isSpamSubmission(req.body)) {
    renderInvalidSurveyForm(res, {});
    return;
  }

  var data = surveyData.convertPostDataToProfile(req.body);
  var surveyValidationErrors = survey.validate(data);

  if (Object.keys(surveyValidationErrors).length) {
    renderInvalidSurveyForm(res, data, surveyValidationErrors);
  } else {
    var apiClient = api.createApiClient();
    renderRecommendations(res, next, {
      apiClient: apiClient,
      ipAddress: req.ip,
      isRegistered: req.cookies[settings.cookies.registered] === '1',
      surveyData: data
    });
  }
};
