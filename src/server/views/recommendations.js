import IndexPage from 'himation/ui/containers/pages';
import RecommendationsPage from 'himation/ui/containers/pages/recommendations';
import { convertPostDataToStateShape } from 'himation/ui/reducers/survey';
import { createApiClient, packageSurvey } from 'himation/server/api';
import { prerenderPageComponent } from 'himation/ui/rendering';
import { renderHtml } from 'himation/server/rendering';
import { isSpamSubmission, validate } from 'himation/ui/components/survey';

/**
 * Render an invalid survey form
 *
 * @param {Response} res The server response
 * @param {object} data The survey state shape
 */
function renderInvalidSurveyForm(res, data) {
  const markup = prerenderPageComponent(res, IndexPage, {
    survey: {
      ...data,
      form: {
        failedValidation: true,
        isSubmitting: false
      }
    }
  });
  res.send(renderHtml(markup));
}

/**
 * Render recommendations for a survey
 *
 * @param {Response} res The server response
 * @param {function} next An Express next callback
 * @param {object} surveyData The survey state shape
 * @param {ApiClient} apiClient A himation API client
 */
function renderRecommendations(res, next, surveyData, apiClient) {
  apiClient.requestRecommendations(packageSurvey(surveyData))
    .then(function(recommendations) {
      const markup = prerenderPageComponent(res, RecommendationsPage, {
        recommendations: recommendations
      });
      res.send(renderHtml(markup));
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

  const surveyData = convertPostDataToStateShape(req.body);
  const surveyValidationErrors = validate(surveyData);

  if (Object.keys(surveyValidationErrors).length) {
    renderInvalidSurveyForm(res, surveyData);
  } else {
    const apiClient = createApiClient(settings.chiton.endpoint, settings.chiton.token);
    renderRecommendations(res, next, surveyData, apiClient);
  }
}
