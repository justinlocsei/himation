import React, { PropTypes } from 'react';

import ErrorMessage from 'himation/ui/components/survey/error-message';
import Size from './size';
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
                    if (!field) { return sizes; }

                    sizes.push(<Size field={field} id={id} key={sizeIndex} size={size}/>);
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
