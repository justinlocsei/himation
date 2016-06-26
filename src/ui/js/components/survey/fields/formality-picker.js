import React, { PropTypes } from 'react';

import Formality from './formality';

const FORMALITIES = [
  {name: 'Casual', slug: 'casual'},
  {name: 'Dressy casual', slug: 'dressy-casual'},
  {name: 'Business casual', slug: 'business-casual'},
  {name: 'Dressy business casual', slug: 'dressy-business-casual'},
  {name: 'Executive casual', slug: 'executive-casual'},
  {name: 'Executive', slug: 'executive'}
];

const FormalityPicker = React.createClass({

  propTypes: {
    fieldID: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired
  },

  render: function() {
    const { fieldID, fieldName } = this.props;

    const formalityTags = FORMALITIES.map(function(formality, index) {
      return (
        <li className="c--formality-picker__formality" key={index}>
          <Formality
            fieldID={fieldID}
            fieldName={fieldName}
            name={formality.name}
            slug={formality.slug}
          />
        </li>
      );
    });

    return (
      <div className="c--formality-picker">
        <fieldset className="c--formality-picker__choices">
          <legend className="c--formality-picker__choices__title">How often do your male colleagues dress like this?</legend>

          <ul className="c--formality-picker__formalities">
            {formalityTags}
          </ul>
        </fieldset>
      </div>
    );
  }

});

export default FormalityPicker;
