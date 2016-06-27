import { createApiClient } from 'himation/server/api';
import RecommendationsPage from 'himation/ui/js/containers/pages/recommendations';
import { renderReactComponent } from 'himation/server/views';

export function renderResponse(req, res, settings) {
  const apiClient = createApiClient(settings.chiton.endpoint, settings.chiton.token);
  const apiRequest = apiClient.requestRecommendations(req.body);

  apiRequest
    .then(function(recommendations) {
      res.render('pages/recommendations', {
        content: renderReactComponent(RecommendationsPage)
      });
    })
    .catch(function(error) {
      res.render('pages/recommendations', {
        content: error.message
      })
    });
}
