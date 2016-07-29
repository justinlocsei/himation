import React, { PropTypes } from 'react';

import { FREQUENCIES } from 'himation/core/data/survey';

const Formality = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  },

  render: function() {
    const { field, id, image, name, slug } = this.props;

    const frequencyTags = FREQUENCIES.map(function(frequency, index) {
      const inputID = `${id}-${slug}-${frequency.slug}`;

      return (
        <li className="c--formality__frequency" key={index}>
          <input className="c--formality__frequency__input" id={inputID} type="radio" {...field.frequency} value={frequency.slug} checked={field.frequency.value === frequency.slug} />
          <label className="c--formality__frequency__label" htmlFor={inputID}>{frequency.name}</label>
        </li>
      );
    });

    let errorTag;
    if (field.touched && field.error) {
      errorTag = <p className="c--formality__error">{field.error}</p>;
    }

    return (
      <div className="c--formality">
        {errorTag}

        <div className="c--formality__details">
          <div className="c--formality__media">
            <img className="c--formality__media__image" src={image} alt={name} />
          </div>

          <fieldset className="c--formality__text">
            <legend className="c--formality__name">{name}</legend>

            <ul className="c--formality__frequencies">
              {frequencyTags}
            </ul>
          </fieldset>

        </div>

        <input type="hidden" {...field.slug} />
      </div>
    );
  }

});

export default Formality;
