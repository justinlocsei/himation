import React, { PropTypes } from 'react';

import ErrorMessage from 'himation/ui/components/survey/error-message';
import { STYLES } from 'himation/core/data/survey';

const StylePicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    maxStyles: PropTypes.number.isRequired
  },

  render: function() {
    const { fields, id, maxStyles } = this.props;

    const selectedFields = fields.filter(field => field.isSelected.value);
    const atQuota = selectedFields.length >= maxStyles;

    const styleTags = fields.map(function(field, index) {
      const style = STYLES.find(s => s.slug === field.slug.value);
      const inputID = `${id}-${style.slug}`;

      return (
        <li className="c--style-picker__style" key={index}>
          <input className="c--style-picker__style__input" id={inputID} type="checkbox" {...field.isSelected} value={null} checked={field.isSelected.value} disabled={atQuota && !field.isSelected.value} />
          <label className="c--style-picker__style__label" htmlFor={inputID}>{style.name}</label>
          <input type="hidden" {...field.slug} />
        </li>
      );
    });

    const fieldErrors = fields.reduce(function(previous, field) {
      if (field.touched && field.error) {
        previous.push(field.error);
      }
      return previous;
    }, []);

    let errorTag;
    if (fieldErrors.length) {
      errorTag = <ErrorMessage className="c--style-picker__error">{fieldErrors[0]}</ErrorMessage>;
    }

    const classes = ['c--style-picker'];
    if (errorTag) {
      classes.push('is-invalid');
    }

    return (
      <div className={classes.join(' ')}>
        {errorTag}

        <ul className="c--style-picker__styles">
          {styleTags}
        </ul>
      </div>
    );
  }

});

export default StylePicker;
