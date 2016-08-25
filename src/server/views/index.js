import IndexPage from 'himation/ui/containers/pages';
import { allowGatewayCaching } from 'himation/server/caching';
import { prerenderPageComponent } from 'himation/ui/rendering';

export function renderResponse(req, res, next, settings) {
  prerenderPageComponent(allowGatewayCaching(res, settings.caching.ttl), IndexPage);
}
