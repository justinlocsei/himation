import React, { PropTypes } from 'react';

import { extractInputProps } from 'himation/core/extensions/redux-form';
import { imageSizesToDimensions, imageSizesToSrcset } from 'himation/core/images';

const BodyShape = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({
      height: PropTypes.number.isRequired,
      path: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    })).isRequired,
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    slug: PropTypes.string.isRequired
  },

  shouldComponentUpdate: function(nextProps) {
    return this.props.selected !== nextProps.selected;
  },

  render: function() {
    const { field, id, images, name, selected, slug } = this.props;

    const inputID = `${id}-${slug}`;

    return (
      <div className="c--body-shape">
        <input className="c--body-shape__input" id={inputID} type="radio" {...extractInputProps(field)} value={slug} checked={selected} />

        <label className="c--body-shape__example" htmlFor={inputID}>
          <img className="c--body-shape__example__image" src={images[0].path} srcSet={imageSizesToSrcset(images)} alt={`${name} body shape`} {...imageSizesToDimensions(images, 120)} />
          <span className="c--body-shape__example__caption">{name}</span>
        </label>
      </div>
    );
  }

});

export default BodyShape;
