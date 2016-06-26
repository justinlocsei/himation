import React, { PropTypes } from 'react';

const CARE_TYPES = [
  {name: 'Hand wash', slug: 'hand-wash'},
  {name: 'Dry clean', slug: 'dry-clean'}
];

const CareTypePicker = React.createClass({

  propTypes: {
    fieldID: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired
  },

  render: function() {
    const { fieldID, fieldName } = this.props;

    const careTags = CARE_TYPES.map(function(careType, index) {
      const id = `${fieldID}-${careType.slug}`;

      return (
        <li className="c--care-type-picker__type" key={index}>
          <input className="c--care-type-picker__type__input" type="checkbox" name={fieldName} id={id} />
          <label className="c--care-type-picker__type__label" htmlFor={id}>{careType.name}</label>
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
