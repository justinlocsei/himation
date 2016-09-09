import modernizrUrl from 'modernizr-build';
import Raven from 'raven-js';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { render as reactRender } from 'react-dom';
import { renderToString } from 'react-dom/server';

import appReducers from 'himation/ui/reducers';
import facebookShareImage from 'himation/images/branding/facebook-share.jpg';
import favicon from 'himation/images/branding/favicon.ico';
import logo from 'himation/images/branding/logo.svg';
import touchIcon from 'himation/images/branding/apple-touch-icon.png';
import twitterLogo from 'himation/images/branding/twitter-logo.png';
import { getSetting } from 'himation/ui/config';

import 'himation/styles/site';

let ReactPerf;
if (__WEBPACK_DEF_HIMATION_DEBUG) {
  ReactPerf = require('react-addons-perf');
}

const APP_CONTAINER_ID = 'app-content';
const STATE_VARIABLE_NAME = 'HIMATION_STATE';

/**
 * Bind an instantiated React component to the Redux store
 *
 * @param {React.Component} component An instance of a React component
 * @param {object} [initialState] The initial state of the store
 * @param {object} [devTools] An instance of the Redux dev-tools middleware
 * @returns {React.Component} The initial component, wrapped in a provider
 * @private
 */
function bindComponentToStore(component, initialState, devTools) {
  const reducers = combineReducers({
    ...appReducers,
    form: formReducer
  });

  const middleware = [applyMiddleware(thunkMiddleware)];
  if (devTools) { middleware.push(devTools); }

  const store = createStore(reducers, initialState, compose(...middleware));
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
 * Pre-render a page component
 *
 * This renders the entire document using a template that contains the
 * pre-rendered page component and information on the state used to render the
 * page, to allow React to reconcile the server output with the client code.
 *
 * @param {express.Response} res An Express response
 * @param {React.Component} Page A React page component
 * @param {object} [options] Options for rendering the page
 * @param {object} [options.context] Additional context for rendering the template
 * @param {object} [options.state] The initial Redux application state
 * @param {string} [options.template] The path to the template to render
 */
export function prerenderPageComponent(res, Page, options = {}) {
  const settings = {
    context: {},
    state: undefined,
    template: 'layouts/main.html',
    ...options
  };

  const page = React.createElement(Page);
  const connectedPage = bindComponentToStore(page, settings.state);

  res.render(settings.template, {
    ...settings.context,
    assets: res.locals.assets,
    content: renderToString(connectedPage),
    contentId: APP_CONTAINER_ID,
    copyrightYear: new Date().getFullYear(),
    facebookShareImage: facebookShareImage.src,
    favicon: favicon,
    facebookAppId: getSetting('facebookAppId'),
    googleAnalyticsId: getSetting('googleAnalyticsId'),
    logo: logo,
    modernizrUrl: modernizrUrl,
    reduxState: JSON.stringify(connectedPage.props.store.getState()),
    rootUrl: getSetting('rootUrl'),
    stateVariableName: STATE_VARIABLE_NAME,
    twitterLogo: twitterLogo.src,
    touchIcon: touchIcon.src
  });
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

  const storeArgs = [page, getPrerenderedState()];
  if (getSetting('debug') && window.devToolsExtension) {
    storeArgs.push(window.devToolsExtension());
  }

  if (ReactPerf) {
    window.ReactPerf = ReactPerf;
  }

  const connectedPage = bindComponentToStore.apply(bindComponentToStore, storeArgs);

  reactRender(connectedPage, document.getElementById(APP_CONTAINER_ID));
}
