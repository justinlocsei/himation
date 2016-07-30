import React, { PropTypes } from 'react';

import ErrorMessage from 'himation/ui/components/survey/error-message';
import { SIZE_GROUPS } from 'himation/core/data/survey';

const SizePicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    const fieldErrors = fields.reduce(function(previous, field) {
      if (field.touched && field.error) {
        previous.push(field.error);
      }
      return previous;
    }, []);

    let errorTag;
    if (fieldErrors.length) {
      errorTag = <ErrorMessage className="c--size-picker__error">{fieldErrors[0]}</ErrorMessage>;
    }

    const classes = ['c--size-picker'];
    if (errorTag) {
      classes.push('is-invalid');
    }

    return (
      <div className={classes.join(' ')}>
        {errorTag}

        <div className="c--size-picker__groups">
          {SIZE_GROUPS.map(function(group, index) {
            return (
              <fieldset className="c--size-picker__group" key={index}>
                <legend className="c--size-picker__group__name">{group.name}</legend>
                <ul className="c--size-picker__group__sizes">
                  {group.sizes.reduce(function(sizes, size, sizeIndex) {
                    const field = fields.find(f => f.slug.value === size.slug);
                    const inputID = `${id}-${size.slug}`;

                    if (!field) { return sizes; }

                    let range;
                    if (size.rangeMin === size.rangeMax) {
                      range = size.rangeMin;
                    } else {
                      range = `${size.rangeMin}${String.fromCharCode(8211)}${size.rangeMax}`;
                    }

                    sizes.push(
                      <li className="c--size-picker__size" key={sizeIndex}>
                        <input className="c--size-picker__size__input" id={inputID} type="checkbox" {...field.isSelected} value={null} checked={field.isSelected.value} />
                        <label className="c--size-picker__size__label" htmlFor={inputID}>
                          <span className="c--size-picker__size__name">{size.name}</span>
                          <span className="c--size-picker__size__range">{range}</span>
                        </label>
                        <input type="hidden" {...field.slug} />
                      </li>
                    );

                    return sizes;
                  }, [])}
                </ul>
              </fieldset>
            );
          })}
        </div>
      </div>
    );
  }

});

export default SizePicker;
