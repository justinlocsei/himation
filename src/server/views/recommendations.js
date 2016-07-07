import IndexPage from 'himation/ui/js/containers/pages';
import RecommendationsPage from 'himation/ui/js/containers/pages/recommendations';
import { convertPostDataToStateShape } from 'himation/ui/js/reducers/survey';
import { createApiClient } from 'himation/server/api';
import { prerenderPageComponent } from 'himation/ui/js/rendering';
import { validate } from 'himation/ui/js/components/survey';

export function renderResponse(req, res, settings) {
  const data = convertPostDataToStateShape(req.body);
  const errors = validate(data);

  if (Object.keys(errors).length) {
    return res.render('pages/index', {
      content: prerenderPageComponent(IndexPage, {
        survey: data
      })
    });
  }

  const apiClient = createApiClient(settings.chiton.endpoint, settings.chiton.token);
  const apiRequest = apiClient.requestRecommendations(data);

  apiRequest
    .then(function() {
      res.render('pages/recommendations', {
        content: prerenderPageComponent(RecommendationsPage)
      });
    })
    .catch(function(error) {
      res.render('pages/recommendations', {
        content: error.message
      });
    });
}
