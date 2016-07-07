import React, { PropTypes } from 'react';

import { SIZES } from 'himation/ui/js/data/survey';

const SizePicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    const sizeTags = fields.map(function(field, index) {
      const size = SIZES.find(s => s.slug === field.slug.value);
      const inputID = `${id}-${size.slug}`;

      return (
        <li className="c--size-picker__size" key={index}>
          <input className="c--size-picker__size__input" id={inputID} type="checkbox" {...field.isSelected} value={null} checked={field.isSelected.value} />
          <label className="c--size-picker__size__label" htmlFor={inputID}>{size.name}</label>
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
    if (fieldErrors) {
      errorTag = <p className="c--size-picker__error">{fieldErrors[0]}</p>;
    }

    const classes = ['c--size-picker'];
    if (errorTag) {
      classes.push('is-invalid');
    }

    return (
      <div className={classes.join(' ')}>
        <fieldset className="c--size-picker__fields">
          <legend className="c--size-picker__fields__title">Which sizes do you wear?</legend>

          {errorTag}

          <ul className="c--size-picker__sizes">
            {sizeTags}
          </ul>
        </fieldset>
      </div>
    );
  }

});

export default SizePicker;
