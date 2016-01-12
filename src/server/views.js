'use strict';

var React = require('react');
var ReactDomServer = require('react-dom/server');

/**
 * Render a React UI component for a page to a string
 *
 * @param {React.Component} component An React UI component class
 * @param {object} props The properties to use to render the class
 * @returns {string} The rendered component
 */
function render(component, props) {
  var instance = React.createElement(component, props);
  return ReactDomServer.renderToString(instance);
}

module.exports = {
  render: render
};
