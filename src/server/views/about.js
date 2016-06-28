import AboutPage from 'himation/ui/js/containers/pages/about';
import { prerenderPage } from 'himation/ui/js/server';

export function renderResponse(req, res) {
  res.render('pages/about', {
    content: prerenderPage(AboutPage)
  });
}
