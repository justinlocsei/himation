import IndexPage from 'himation/ui/js/containers/pages';
import RecommendationsPage from 'himation/ui/js/containers/pages/recommendations';
import { convertPostDataToStateShape } from 'himation/ui/js/reducers/survey';
import { createApiClient, packageSurvey } from 'himation/server/api';
import { prerenderPageComponent } from 'himation/ui/js/rendering';
import { validate } from 'himation/ui/js/components/survey';

/**
 * Render an invalid survey form
 *
 * @param {Response} res The server response
 * @param {object} data The survey state shape
 */
function renderInvalidSurveyForm(res, data) {
  res.render('pages/index', {
    content: prerenderPageComponent(IndexPage, {
      survey: {
        ...data,
        form: {
          failedValidation: true,
          isSubmitting: false
        }
      }
    })
  });
}

/**
 * Render recommendations for a survey
 *
 * @param {Response} res The server response
 * @param {object} surveyData The survey state shape
 * @param {ApiClient} apiClient A himation API client
 */
function renderRecommendations(res, surveyData, apiClient) {
  apiClient.requestRecommendations(packageSurvey(surveyData))
    .then(function(recommendations) {
      res.render('pages/recommendations', {
        content: prerenderPageComponent(RecommendationsPage, {
          recommendations: recommendations.basics
        })
      });
    })
    .catch(function(error) {
      res.render('pages/recommendations', {
        content: error.message
      });
    });
}

export function renderResponse(req, res, settings) {
  const surveyData = convertPostDataToStateShape(req.body);
  const surveyValidationErrors = validate(surveyData);

  if (Object.keys(surveyValidationErrors).length) {
    renderInvalidSurveyForm(res, surveyData);
  } else {
    const apiClient = createApiClient(settings.chiton.endpoint, settings.chiton.token);
    renderRecommendations(res, surveyData, apiClient);
  }
}
