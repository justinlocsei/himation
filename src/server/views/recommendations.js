import IndexPage from 'himation/ui/containers/pages';
import RecommendationsPage from 'himation/ui/containers/pages/recommendations';
import { convertPostDataToProfile } from 'himation/server/data/survey';
import { createApiClient, packageSurvey } from 'himation/server/api';
import { prerenderPageComponent } from 'himation/ui/rendering';
import { isSpamSubmission, validate } from 'himation/ui/components/survey';

/**
 * Render an invalid survey form
 *
 * @param {Response} res The server response
 * @param {HimationSurveyData} data The survey state shape
 * @param {object} errors Possible validation errors
 */
function renderInvalidSurveyForm(res, data, errors) {
  prerenderPageComponent(res, IndexPage, {
    state: {
      survey: {
        ...data,
        errors: errors,
        form: {
          failedValidation: true,
          isSubmitting: false
        }
      }
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
 * @param {HimationSurveyData} options.surveyData The survey data
 */
function renderRecommendations(res, next, options) {
  const { apiClient, ipAddress, surveyData } = options;

  apiClient.requestRecommendations(packageSurvey(surveyData), {ip: ipAddress})
    .then(function(recommendations) {
      prerenderPageComponent(res, RecommendationsPage, {
        state: {
          recommendations: recommendations
        }
      });
    })
    .catch(function(error) {
      next(error);
    });
}

export function renderResponse(req, res, next, settings) {
  if (isSpamSubmission(req.body)) {
    renderInvalidSurveyForm(res, {});
    return;
  }

  const surveyData = convertPostDataToProfile(req.body);
  const surveyValidationErrors = validate(surveyData);

  if (Object.keys(surveyValidationErrors).length) {
    renderInvalidSurveyForm(res, surveyData, surveyValidationErrors);
  } else {
    const apiClient = createApiClient(settings.chiton.endpoint, settings.chiton.token);
    renderRecommendations(res, next, {
      apiClient: apiClient,
      ipAddress: req.ip,
      surveyData: surveyData
    });
  }
}
