import Index from 'himation/ui/js/components/pages/index';
import { render } from 'himation/server/views';

export function renderResponse(req, res) {
  res.render('pages/index', {
    content: render(Index)
  });
}
