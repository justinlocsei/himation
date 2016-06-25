import IndexPage from 'himation/ui/js/containers/pages';
import { renderReactComponent } from 'himation/server/views';

export function renderResponse(req, res) {
  res.render('pages/index', {
    content: renderReactComponent(IndexPage)
  });
}
