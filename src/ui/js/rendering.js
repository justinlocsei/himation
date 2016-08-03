import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { render as reactRender } from 'react-dom';
import { renderToString } from 'react-dom/server';

import appReducers from 'himation/ui/reducers';
import Site from 'himation/ui/containers/site';

const APP_CONTAINER_ID = 'app-content';
const STATE_VARIABLE_NAME = 'HIMATION_STATE';

/**
 * Bind an instantiated React component to the Redux store
 *
 * @param {React.Component} component An instance of a React component
 * @param {object} [initialState] The initial state of the store
 * @param {object[]} [middleware] Middleware to add to the store
 * @returns {React.Component} The initial component, wrapped in a provider
 * @private
 */
function bindComponentToStore(component, initialState, middleware) {
  const reducers = combineReducers({
    ...appReducers,
    form: formReducer
  });

  const store = createStore(reducers, initialState, middleware);
  return React.createElement(Provider, {store: store}, component);
}

/**
 * Return the state used to pre-render the current page
 *
 * @returns {object}
 */
export function getPrerenderedState() {
  return window[STATE_VARIABLE_NAME] || {};
}

/**
 * Pre-render a page component to a string
 *
 * @param {React.Component} Page A React page component
 * @param {object} [state] The initial Redux application state
 * @returns {string} The rendered page
 */
export function prerenderPageComponent(Page, state) {
  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);
  const connectedSite = bindComponentToStore(site, state);

  // Double-render the page to fix initial-value issues with redux-form
  // See: https://github.com/erikras/redux-form/issues/621
  let markup = renderToString(connectedSite);
  markup = renderToString(connectedSite);

  return `
    <div class="l--app__content" id="${APP_CONTAINER_ID}">${markup}</div>
    <script>
      window['${STATE_VARIABLE_NAME}'] = ${JSON.stringify(connectedSite.props.store.getState())};
    </script>
  `;
}

/**
 * Render a page component on the client using the pre-rendered state
 *
 * @param {React.Component} Page A React page component
 */
export function renderPageComponent(Page) {
  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);

  const storeArgs = [site, getPrerenderedState()];
  if (window.devToolsExtension) {
    storeArgs.push(window.devToolsExtension());
  }

  const connectedSite = bindComponentToStore.apply(bindComponentToStore, storeArgs);

  reactRender(connectedSite, document.getElementById(APP_CONTAINER_ID));
}
