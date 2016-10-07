import React, { PropTypes } from 'react';

import BodyShape from './body-shape';
import ErrorMessage from 'himation/ui/components/survey/error-message';
import { BODY_SHAPES } from 'himation/core/data/survey';

const IMAGE_SIZES = ['1x', '2x'];

const IMAGES = BODY_SHAPES.reduce(function(previous, bodyShape) {
  previous[bodyShape.slug] = IMAGE_SIZES.map(function(size) {
    const image = require(`himation/images/body-shapes/${bodyShape.slug}-${size}.png`);
    return {
      height: image.height,
      path: image.src,
      size: size,
      width: image.width
    };
  });
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
            images={IMAGES[bodyShape.slug]}
            name={bodyShape.name.title}
            selected={field.value === bodyShape.slug}
            slug={bodyShape.slug}
          />
        </li>
      );
    });

    let errorTag;
    if (field.touched && field.error) {
      errorTag = <ErrorMessage className="c--body-shape-picker__error">{field.error}</ErrorMessage>;
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
