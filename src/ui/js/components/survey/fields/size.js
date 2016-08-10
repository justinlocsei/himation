import React, { PropTypes } from 'react';

import { extractInputProps } from 'himation/core/extensions/redux-form';

const Size = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    size: PropTypes.object.isRequired
  },

  shouldComponentUpdate: function(nextProps) {
    return this.props.field.isSelected.value !== nextProps.field.isSelected.value;
  },

  render: function() {
    const { field, id, size } = this.props;

    const inputID = `${id}-${size.slug}`;

    let range;
    if (size.rangeMin === size.rangeMax) {
      range = size.rangeMin;
    } else {
      range = `${size.rangeMin}${String.fromCharCode(8211)}${size.rangeMax}`;
    }

    return (
      <li className="c--size-picker__size">
        <input className="c--size-picker__size__input" id={inputID} type="checkbox" {...extractInputProps(field.isSelected)} checked={field.isSelected.value} />
        <label className="c--size-picker__size__label" htmlFor={inputID}>
          <span className="c--size-picker__size__name">{size.name}</span>
          <span className="c--size-picker__size__range">{range}</span>
        </label>
        <input type="hidden" {...extractInputProps(field.slug)} />
      </li>
    );
  }

});

export default Size;
