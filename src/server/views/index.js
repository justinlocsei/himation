import IndexPage from 'himation/ui/js/containers/pages';
import { prerenderPage } from 'himation/ui/js/server';

export function renderResponse(req, res) {
  res.render('pages/index', {
    content: prerenderPage(IndexPage)
  });
}
