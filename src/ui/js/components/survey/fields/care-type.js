import React, { PropTypes } from 'react';

import { extractInputProps } from 'himation/core/extensions/redux-form';

const CareType = React.createClass({

  propTypes: {
    careType: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  },

  shouldComponentUpdate: function(nextProps) {
    return this.props.field.isSelected.value !== nextProps.field.isSelected.value;
  },

  render: function() {
    const { careType, field, id } = this.props;

    const inputID = `${id}-${careType.slug}`;

    return (
      <li className="c--care-type-picker__type">
        <input className="c--care-type-picker__type__input" id={inputID} type="checkbox" {...extractInputProps(field.isSelected)} checked={field.isSelected.value} />
        <label className="c--care-type-picker__type__label" htmlFor={inputID}>Avoid {careType.name.toLowerCase()}</label>
        <input type="hidden" {...extractInputProps(field.slug)} />
      </li>
    );
  }

});

export default CareType;
