import AboutPage from 'himation/ui/js/containers/pages/about';
import { renderReactComponent } from 'himation/server/views';

export function renderResponse(req, res) {
  res.render('pages/about', {
    content: renderReactComponent(AboutPage)
  });
}
