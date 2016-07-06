import React, { PropTypes } from 'react';

import BodyShape from './body-shape';

const BODY_SHAPES = [
  {name: 'Pear', slug: 'pear'},
  {name: 'Hourglass', slug: 'hourglass'},
  {name: 'Inverted triangle', slug: 'inverted'},
  {name: 'Apple', slug: 'apple'},
  {name: 'Rectangle', slug: 'rectangle'}
];

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
        <fieldset className="c--body-shape-picker__choices">
          <legend className="c--body-shape-picker__choices__title">Body Shape</legend>

          {errorTag}

          <ul className="c--body-shape-picker__body-shapes">
            {bodyShapeTags}
          </ul>
        </fieldset>
      </div>
    );
  }

});

export default BodyShapePicker;
