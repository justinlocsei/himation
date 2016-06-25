'use strict';

var React = require('react');
var ReactDomServer = require('react-dom/server');

/**
 * Render a React UI component for a page to a string
 *
 * @param {React.Component} component A React component class
 * @param {object} props The component's properties
 * @returns {string} The rendered component
 */
function renderReactComponent(component, props) {
  var instance = React.createElement(component, props);
  return ReactDomServer.renderToString(instance);
}

module.exports = {
  renderReactComponent: renderReactComponent
};
