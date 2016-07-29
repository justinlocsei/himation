import React, { PropTypes } from 'react';

const BodyShape = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  },

  render: function() {
    const { field, id, image, name, slug } = this.props;

    const inputID = `${id}-${slug}`;

    return (
      <div className="c--body-shape">
        <input className="c--body-shape__input" id={inputID} type="radio" {...field} value={slug} checked={field.value === slug} />

        <label className="c--body-shape__example" htmlFor={inputID}>
          <figure className="c--body-shape__graphic">
            <img className="c--body-shape__graphic__image" src={image} />
            <figcaption className="c--body-shape__graphic__caption">{name}</figcaption>
          </figure>
        </label>
      </div>
    );
  }

});

export default BodyShape;
