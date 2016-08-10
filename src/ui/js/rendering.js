import Raven from 'raven-js';
import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { render as reactRender } from 'react-dom';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';

import appReducers from 'himation/ui/reducers';
import Document from 'himation/ui/containers/site/document';
import Site from 'himation/ui/containers/site';
import { getSetting } from 'himation/ui/config';

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
 * Configure error tracking if a Sentry DSN is detected
 *
 * @private
 */
function configureErrorTracking() {
  const dsn = getSetting('sentryDsn');
  if (!dsn) { return; }

  Raven.config(dsn, {environment: getSetting('environment')}).install();
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
 * This renders the entire document using a static-markup document component as
 * a wrapper for a traditionally rendered site component that contains the given
 * page component.
 *
 * @param {express.Response} res An Express response
 * @param {React.Component} Page A React page component
 * @param {object} [options] Options for rendering the page
 * @param {object} [options.state] The initial Redux application state
 * @param {object} [options.documentProps] Props to pass to the document container
 * @returns {string} The rendered page
 */
export function prerenderPageComponent(res, Page, options = {}) {
  const settings = {
    documentProps: {},
    state: undefined,
    ...options
  };

  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);
  const connectedSite = bindComponentToStore(site, settings.state);

  // Double-render the page to fix initial-value issues with redux-form
  // See: https://github.com/erikras/redux-form/issues/621
  let markup = renderToString(connectedSite);
  markup = renderToString(connectedSite);

  const container = React.createElement(Document, {
    ...settings.documentProps,
    assets: res.locals.assets,
    content: markup,
    contentId: APP_CONTAINER_ID,
    stateVariableName: STATE_VARIABLE_NAME,
    store: connectedSite.props.store.getState()
  });

  return renderToStaticMarkup(container);
}

/**
 * Render a page component on the client using the pre-rendered state
 *
 * This renders the page component within a site component, and extracts the
 * Redux state used to render the initial document from a global variable.
 *
 * @param {React.Component} Page A React page component
 */
export function renderPageComponent(Page) {
  configureErrorTracking();

  const page = React.createElement(Page);
  const site = React.createElement(Site, null, page);

  const storeArgs = [site, getPrerenderedState()];
  if (window.devToolsExtension) {
    storeArgs.push(window.devToolsExtension());
  }

  const connectedSite = bindComponentToStore.apply(bindComponentToStore, storeArgs);

  reactRender(connectedSite, document.getElementById(APP_CONTAINER_ID));
}
