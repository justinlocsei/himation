import React from 'react';
import { renderToString } from 'react-dom/server';

import Site from 'himation/ui/js/containers/site';
import { bindAppToStore } from 'himation/ui/js/store';

const DOM_CONTAINER_ID = 'app-content';
const STATE_VARIABLE_NAME = 'HIMATION_STATE';

/**
 * Pre-render a page component to a string
 *
 * @param {React.Component} Page A React page component
 * @param {object} [state] The initial Redux application state
 * @returns {string} The rendered page
 */
export function prerenderPage(Page, state) {
  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);
  const connectedSite = bindAppToStore(site, state);

  // Double-render the page to fix initial-value issues with redux-form
  // See: https://github.com/erikras/redux-form/issues/621
  let markup = renderToString(connectedSite);
  markup = renderToString(connectedSite);

  return `
    <div class="l--app__content" id="${DOM_CONTAINER_ID}">${markup}</div>
    <script>
      window.${STATE_VARIABLE_NAME} = ${JSON.stringify(connectedSite.props.store.getState())};
    </script>
  `;
}

export { DOM_CONTAINER_ID, STATE_VARIABLE_NAME };
