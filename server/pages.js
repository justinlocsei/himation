'use strict';

var React = require('react');
var ReactDomServer = require('react-dom/server');

var About = requireComponent('about');
var Index = requireComponent('index');

/**
 * Render the body content for the about page
 *
 * @returns {string}
 */
function about() {
  return ReactDomServer.renderToString(React.createElement(About));
}

/**
 * Render the body content for the index page
 *
 * @returns {string}
 */
function index() {
  return ReactDomServer.renderToString(React.createElement(Index));
}

/**
 * Require the named UI React component
 *
 * @param {string} name The name of the component's file
 * @returns {Object} The requested component
 * @private
 */
function requireComponent(name) {
  return require('../ui/js/components/' + name);
}

module.exports = {
  about: about,
  index: index
};
