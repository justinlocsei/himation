import IndexPage from 'himation/ui/containers/pages';
import { prerenderPageComponent } from 'himation/ui/rendering';
import { renderHtml } from 'himation/server/rendering';

export function renderResponse(req, res) {
  const markup = prerenderPageComponent(res, IndexPage);
  res.send(renderHtml(markup));
}
