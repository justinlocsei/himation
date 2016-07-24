import React, { PropTypes } from 'react';

import BodyShape from './body-shape';
import { BODY_SHAPES } from 'himation/core/data/survey';

const images = BODY_SHAPES.reduce(function(previous, bodyShape) {
  previous[bodyShape.slug] = require(`himation/images/body-shapes/${bodyShape.slug}.svg`);
  return previous;
}, {});

const BodyShapePicker = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { field, id } = this.props;

    const bodyShapeTags = BODY_SHAPES.map(function(bodyShape, index) {
      return (
        <li className="c--body-shape-picker__body-shape" key={index}>
          <BodyShape
            field={field}
            id={id}
            name={bodyShape.name}
            shape={images[bodyShape.slug]}
            slug={bodyShape.slug}
          />
        </li>
      );
    });

    let errorTag;
    if (field.touched && field.error) {
      errorTag = <p className="c--body-shape-picker__error">{field.error}</p>;
    }

    const classes = ['c--body-shape-picker'];
    if (errorTag) {
      classes.push('is-invalid');
    }

    return (
      <div className={classes.join(' ')}>
        {errorTag}

        <ul className="c--body-shape-picker__body-shapes">
          {bodyShapeTags}
        </ul>
      </div>
    );
  }

});

export default BodyShapePicker;
