import React, { PropTypes } from 'react';

import CareType from './care-type';
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

            return (
              <CareType
                careType={careType}
                field={field}
                id={id}
                key={index}
              />
            );
          })}
        </ul>
      </div>
    );
  }

});

export default CareTypePicker;
