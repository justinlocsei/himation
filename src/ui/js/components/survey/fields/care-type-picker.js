import React, { PropTypes } from 'react';

import { CARE_TYPES } from 'himation/ui/js/data/survey';

const CareTypePicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    const careTags = fields.map(function(field, index) {
      const careType = CARE_TYPES.find(ct => ct.slug === field.slug.value);
      const inputID = `${id}-${careType.slug}`;

      return (
        <li className="c--care-type-picker__type" key={index}>
          <input className="c--care-type-picker__type__input" id={inputID} type="checkbox" {...field.isSelected} value={null} checked={field.isSelected.value} />
          <label className="c--care-type-picker__type__label" htmlFor={inputID}>{careType.name}</label>
          <input type="hidden" {...field.slug} />
        </li>
      );
    });

    return (
      <div className="c--care-type-picker">
        <fieldset className="c--care-type-picker__fields">
          <legend className="c--care-type-picker__fields__title">Should we avoid any of the following care types?</legend>

          <ul className="c--care-type-picker__types">
            {careTags}
          </ul>
        </fieldset>
      </div>
    );
  }

});

export default CareTypePicker;
