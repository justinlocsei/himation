import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';

import appReducers from 'himation/ui/js/reducers';

/**
 * Bind an instantiated React component to the Redux store
 *
 * @param {React.Component} component An instance of a React component
 * @param {object} [initialState] The initial state of the store
 * @returns {React.Component} The initial component, wrapped in a provider
 */
export function bindAppToStore(component, initialState) {
  const reducers = combineReducers({
    ...appReducers,
    form: formReducer
  });

  const store = createStore(reducers, initialState);
  return React.createElement(Provider, {store: store}, component);
}
