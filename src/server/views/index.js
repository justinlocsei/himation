import IndexPage from 'himation/ui/js/containers/pages';
import { prerenderPageComponent } from 'himation/ui/js/rendering';

export function renderResponse(req, res) {
  res.render('pages/index', {
    content: prerenderPageComponent(IndexPage)
  });
}
