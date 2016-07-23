import AboutPage from 'himation/ui/containers/pages/about';
import { prerenderPageComponent } from 'himation/ui/rendering';

export function renderResponse(req, res) {
  res.render('pages/about', {
    content: prerenderPageComponent(AboutPage)
  });
}
