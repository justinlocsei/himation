import Index from 'chiton/ui/js/components/pages/index';
import { render } from 'chiton/server/views';

export function renderResponse(req, res) {
  res.render('pages/index', {
    content: render(Index)
  });
}
