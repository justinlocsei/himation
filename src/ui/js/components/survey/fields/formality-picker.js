import React, { PropTypes } from 'react';

import Formality from './formality';
import { FORMALITIES } from 'himation/core/data/survey';

const FormalityPicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    const formalityTags = fields.map(function(field, index) {
      const formality = FORMALITIES.find(f => f.slug === field.slug.value);

      const classes = ['c--formality-picker__formality'];
      if (field.touched && field.error) {
        classes.push('is-invalid');
      }

      return (
        <li className={classes.join(' ')} key={index}>
          <Formality
            field={field}
            id={id}
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
