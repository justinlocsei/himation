import React, { PropTypes } from 'react';

const BODY_SHAPES = [
  {name: 'Pear', slug: 'pear'},
  {name: 'Hourglass', slug: 'hourglass'},
  {name: 'Inverted triangle', slug: 'inverted'},
  {name: 'Apple', slug: 'apple'},
  {name: 'Rectangle', slug: 'rectangle'}
];

const BodyShapePicker = React.createClass({

  propTypes: {
    fieldID: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired
  },

  render: function() {
    const { fieldID, fieldName } = this.props;

    const options = BODY_SHAPES.map(function(shape, index) {
      return (
        <option value={shape.slug} key={index}>{shape.name}</option>
      );
    });

    return (
      <div className="c--body-shape-picker">
        <label className="c--body-shape-picker__label" htmlFor={fieldID}>Body Shape</label>
        <select className="c--body-shape-picker__choices" name={fieldName} id={fieldID}>{options}</select>
      </div>
    );
  }

});

export default BodyShapePicker;
