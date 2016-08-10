'use strict';

var isEqual = require('lodash/isEqual');
var PropTypes = require('react').PropTypes;

var childProps = {
  multiple: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  single: PropTypes.element
};

/**
 * Determine if any props have changed between two objects
 *
 * @param {object} current The current object
 * @param {object} next The next object
 * @param {string[]} values The values to check
 * @returns {boolean} Whether any values have changed
 */
function anyPropsChanged(current, next, values) {
  return values.reduce(function(isChanged, value) {
    return isChanged || !isEqual(current[value], next[value]);
  }, false);
}

module.exports = {
  anyPropsChanged: anyPropsChanged,
  childProps: childProps
};
