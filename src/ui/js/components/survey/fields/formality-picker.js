import React, { PropTypes } from 'react';

import Formality from './formality';
import { FORMALITIES } from 'himation/core/data/survey';

const IMAGE_SIZES = ['1x', '2x'];

const IMAGES = FORMALITIES.reduce(function(previous, formality) {
  previous[formality.slug] = IMAGE_SIZES.map(function(size) {
    const image = require(`himation/images/formalities/${formality.slug}-${size}.jpg`);
    return {
      height: image.height,
      path: image.src,
      size: size,
      width: image.width
    };
  });
  return previous;
}, {});

const FormalityPicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    return (
      <div className="c--formality-picker">
        <ul className="c--formality-picker__formalities">
          {fields.map(function(field, index) {
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
                  images={IMAGES[formality.slug]}
                  name={formality.name}
                  slug={formality.slug}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

});

export default FormalityPicker;
