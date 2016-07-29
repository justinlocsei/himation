import React, { PropTypes } from 'react';

import { imageSizesToSrcset } from 'himation/core/images';

const BodyShape = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired
    })).isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  },

  render: function() {
    const { field, id, images, name, slug } = this.props;

    const inputID = `${id}-${slug}`;

    return (
      <div className="c--body-shape">
        <input className="c--body-shape__input" id={inputID} type="radio" {...field} value={slug} checked={field.value === slug} />

        <label className="c--body-shape__example" htmlFor={inputID}>
          <figure className="c--body-shape__graphic">
            <img className="c--body-shape__graphic__image" src={images[0].path} srcSet={imageSizesToSrcset(images)} />
            <figcaption className="c--body-shape__graphic__caption">{name}</figcaption>
          </figure>
        </label>
      </div>
    );
  }

});

export default BodyShape;
