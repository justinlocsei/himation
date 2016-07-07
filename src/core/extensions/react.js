'use strict';

var PropTypes = require('react').PropTypes;

var childProps = {
  multiple: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  single: PropTypes.element
};

module.exports = {
  childProps: childProps
};
