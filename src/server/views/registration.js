import routes from 'himation/config/routes';
import { createApiClient } from 'himation/server/api';
import { guidToRoute } from 'himation/core/routing';

export function renderResponse(req, res, next, settings) {
  const apiClient = createApiClient(settings.chiton.endpoint, settings.chiton.token);
  const homePage = guidToRoute(routes, 'himation.index');
  const wantsJson = req.accepts(['html', 'json']) === 'json';

  const data = {
    email: req.body.email,
    recommendationId: parseInt(req.body.recommendationId, 10)
  };

  apiClient.registerUser(data)
    .then(function(wardrobeProfileId) {
      res.cookie(settings.cookies.registered, '1', {
        httpOnly: true,
        maxAge: 90000,
        secure: true
      });

      if (wantsJson) {
        return res.json({
          error: false,
          wardrobeProfileId: wardrobeProfileId
        });
      } else {
        return res.redirect(homePage.path);
      }
    })
    .catch(function(error) {
      if (wantsJson) {
        res.json({error: true});
      } else {
        res.redirect(homePage.path);
      }

      throw(error);
    });
}
