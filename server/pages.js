'use strict';

var React = require('react');
var ReactDomServer = require('react-dom/server');

var ui = require('./ui');

var About = ui.module('components/about');
var Index = ui.module('components/index');

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
