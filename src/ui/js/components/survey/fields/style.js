import React, { PropTypes } from 'react';

import { extractInputProps } from 'himation/core/extensions/redux-form';

const Style = React.createClass({

  propTypes: {
    disabled: PropTypes.bool,
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired
  },

  shouldComponentUpdate: function(nextProps) {
    const selectedChanged = this.props.field.isSelected.value !== nextProps.field.isSelected.value;
    const disabledChanged = this.props.disabled !== nextProps.disabled;

    return selectedChanged || disabledChanged;
  },

  render: function() {
    const { disabled, field, id, style } = this.props;

    const inputID = `${id}-${style.slug}`;

    return (
      <li className="c--style-picker__style">
        <input className="c--style-picker__style__input" id={inputID} type="checkbox" {...extractInputProps(field.isSelected)} checked={field.isSelected.value} disabled={disabled} />
        <label className="c--style-picker__style__label" htmlFor={inputID}>{style.name}</label>
        <input type="hidden" {...extractInputProps(field.slug)} />
      </li>
    );
  }

});

export default Style;
