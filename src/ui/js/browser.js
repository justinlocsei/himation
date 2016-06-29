import React from 'react';
import { render } from 'react-dom';

import Site from 'himation/ui/js/containers/site';
import { bindAppToStore } from 'himation/ui/js/store';
import { DOM_CONTAINER_ID, STATE_VARIABLE_NAME } from 'himation/ui/js/server';

/**
 * Initialize the client-site React application for a given page
 *
 * @param {React.Component} Page A React page component
 */
export function syncClientApp(Page) {
  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);

  const initialState = window[STATE_VARIABLE_NAME] || {};

  const bindAppArgs = [site, initialState];
  if (window.devToolsExtension) {
    bindAppArgs.push(window.devToolsExtension());
  }

  const connectedSite = bindAppToStore.apply(bindAppToStore, bindAppArgs);

  render(connectedSite, document.getElementById(DOM_CONTAINER_ID));
}
