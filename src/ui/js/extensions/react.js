import { PropTypes } from 'react';

const childProps = {
  multiple: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  single: PropTypes.element
};

export { childProps };
