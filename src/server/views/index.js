import IndexPage from 'himation/ui/containers/pages';
import settings from 'himation/core/settings';
import { allowGatewayCaching } from 'himation/server/caching';
import { prerenderPageComponent } from 'himation/ui/rendering';

export function renderResponse(req, res) {
  const cachedResponse = allowGatewayCaching(res, settings.caching.ttl);
  prerenderPageComponent(cachedResponse, IndexPage, {
    template: 'pages/home.html'
  });
}
