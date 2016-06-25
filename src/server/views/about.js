import About from 'himation/ui/js/components/pages/about';
import { render } from 'himation/server/views';

export function renderResponse(req, res) {
  res.render('pages/about', {
    content: renderReactComponent(About)
  });
}
