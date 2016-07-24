import React, { PropTypes } from 'react';

const BodyShape = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shape: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  },

  render: function() {
    const { field, id, name, shape, slug } = this.props;

    const inputID = `${id}-${slug}`;

    return (
      <div className="c--body-shape">
        <label className="c--body-shape__label" htmlFor={inputID}>
          <figure className="c--body-shape__example">
            <div className="c--body-shape__example__image" dangerouslySetInnerHTML={{__html: shape }} />
            <figcaption className="c--body-shape__example__caption">{name}</figcaption>
          </figure>
        </label>

        <input className="c--body-shape__input" id={inputID} type="radio" {...field} value={slug} checked={field.value === slug} />
      </div>
    );
  }

});

export default BodyShape;
