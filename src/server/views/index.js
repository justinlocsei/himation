import IndexPage from 'himation/ui/containers/pages';
import { allowGatewayCaching } from 'himation/server/caching';
import { prerenderPageComponent } from 'himation/ui/rendering';
import { renderHtml } from 'himation/server/rendering';

export function renderResponse(req, res, next, settings) {
  const markup = prerenderPageComponent(res, IndexPage);
  allowGatewayCaching(res, settings.caching.ttl).send(renderHtml(markup));
}
