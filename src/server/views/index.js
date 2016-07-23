import IndexPage from 'himation/ui/containers/pages';
import { prerenderPageComponent } from 'himation/ui/rendering';

export function renderResponse(req, res) {
  res.render('pages/index', {
    content: prerenderPageComponent(IndexPage)
  });
}
