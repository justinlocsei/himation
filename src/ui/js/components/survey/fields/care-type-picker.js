import React, { PropTypes } from 'react';

import { CARE_TYPES } from 'himation/core/data/survey';

const CareTypePicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    return (
      <div className="c--care-type-picker">
        <ul className="c--care-type-picker__types">
          {fields.map(function(field, index) {
            const careType = CARE_TYPES.find(ct => ct.slug === field.slug.value);
            const inputID = `${id}-${careType.slug}`;

            return (
              <li className="c--care-type-picker__type" key={index}>
                <input className="c--care-type-picker__type__input" id={inputID} type="checkbox" {...field.isSelected} value={null} checked={field.isSelected.value} />
                <label className="c--care-type-picker__type__label" htmlFor={inputID}>Avoid {careType.name.toLowerCase()}</label>
                <input type="hidden" {...field.slug} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

});

export default CareTypePicker;
