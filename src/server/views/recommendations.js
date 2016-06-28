import { createApiClient } from 'himation/server/api';
import RecommendationsPage from 'himation/ui/js/containers/pages/recommendations';
import { prerenderPage } from 'himation/ui/js/server';

export function renderResponse(req, res, settings) {
  const apiClient = createApiClient(settings.chiton.endpoint, settings.chiton.token);
  const apiRequest = apiClient.requestRecommendations(req.body);

  apiRequest
    .then(function() {
      res.render('pages/recommendations', {
        content: prerenderPage(RecommendationsPage)
      });
    })
    .catch(function(error) {
      res.render('pages/recommendations', {
        content: error.message
      });
    });
}
