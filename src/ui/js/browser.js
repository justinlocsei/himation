import React from 'react';
import { render } from 'react-dom';

import Site from 'himation/ui/js/containers/site';

/**
 * Initialize the client-site React application for a given page
 *
 * @param {React.Component} Page A React page component
 */
export function syncClientApp(Page) {
  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);

  render(site, document.getElementById('app-content'));
}
