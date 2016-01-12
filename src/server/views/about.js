import About from 'chiton/ui/js/components/pages/about';
import { render } from 'chiton/server/views';

export function renderResponse(req, res) {
  res.render('public', {
    content: render(About)
  });
}
