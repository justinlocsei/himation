'use strict';

var React = require('react');
var ReactDomServer = require('react-dom/server');

var About = requirePage('about');
var Index = requirePage('index');

/**
 * Require a React page component from the UI module
 *
 * @param {string} name The name of the component
 * @returns {object} The required component
 * @throws {Error} If the component cannot be found
 * @private
 */
function requirePage(name) {
  return require('chiton/ui/js/components/pages/' + name);
}

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

module.exports = {
  about: about,
  index: index
};
