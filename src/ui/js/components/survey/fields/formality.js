import React, { PropTypes } from 'react';

import ErrorMessage from 'himation/ui/components/survey/error-message';
import { extractInputProps } from 'himation/core/extensions/redux-form';
import { FREQUENCIES } from 'himation/core/data/survey';
import { imageSizesToSrcset } from 'himation/core/images';

// Dimensions for the formality images
const IMAGE_ASPECT_RATIO = 4 / 9;
const IMAGE_WIDTH = 120;
const IMAGE_HEIGHT = 120 / IMAGE_ASPECT_RATIO;

const Formality = React.createClass({

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

    const frequencyTags = FREQUENCIES.map(function(frequency, index) {
      const inputID = `${id}-${slug}-${frequency.slug}`;

      return (
        <li className="c--formality__frequency" key={index}>
          <input className="c--formality__frequency__input" id={inputID} type="radio" {...extractInputProps(field.frequency, 'radio')} value={frequency.slug} checked={field.frequency.value === frequency.slug} />
          <label className="c--formality__frequency__label" htmlFor={inputID}>{frequency.name}</label>
        </li>
      );
    });

    let errorTag;
    if (field.touched && field.error) {
      errorTag = <ErrorMessage className="c--formality__error">{field.error}</ErrorMessage>;
    }

    return (
      <div className="c--formality">
        <div className="c--formality__details">
          <div className="c--formality__media">
            <img className="c--formality__media__image" src={images[0].path} srcSet={imageSizesToSrcset(images)} alt={name} width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />
          </div>

          <fieldset className="c--formality__text">
            {errorTag}

            <legend className="c--formality__name">{name}</legend>

            <ul className="c--formality__frequencies">
              {frequencyTags}
            </ul>
          </fieldset>

        </div>

        <input type="hidden" {...extractInputProps(field.slug)} />
      </div>
    );
  }

});

export default Formality;
