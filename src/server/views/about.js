import AboutPage from 'himation/ui/js/containers/pages/about';
import { prerenderPageComponent } from 'himation/ui/js/rendering';

export function renderResponse(req, res) {
  res.render('pages/about', {
    content: prerenderPageComponent(AboutPage)
  });
}
