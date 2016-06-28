import React from 'react';
import { renderToString } from 'react-dom/server';

import Site from 'himation/ui/js/containers/site';

/**
 * Pre-render a page component to a string
 *
 * @param {React.Component} Page A React page component
 * @returns {string} The rendered page
 */
function prerenderPage(Page) {
  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);

  return renderToString(site);
}

module.exports = {
  prerenderPage: prerenderPage
};
