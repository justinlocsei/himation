import React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * Pre-render a page component to a string
 *
 * @param {React.Component} Page A React page component
 * @returns {string} The rendered page
 */
function prerenderPage(Page) {
  const page = React.createElement(Page);
  return renderToString(page);
}

module.exports = {
  prerenderPage: prerenderPage
};
