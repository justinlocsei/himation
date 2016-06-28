import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducers from 'himation/ui/js/reducers';

/**
 * Bind an instantiated React component to the Redux store
 *
 * @param {React.Component} component An instance of a React component
 * @param {object} [initialState] The initial state of the store
 * @returns {React.Component} The initial component, wrapped in a provider
 */
export function bindAppToStore(component, initialState) {
  const store = createStore(reducers, initialState);
  return React.createElement(Provider, {store: store}, component);
}
