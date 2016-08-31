import React, { PropTypes } from 'react';

import { anyPropsChanged } from 'himation/core/extensions/react';
import { extractInputProps } from 'himation/core/extensions/redux-form';
import { FREQUENCIES } from 'himation/core/data/survey';
import { imageSizesToDimensions, imageSizesToSrcset } from 'himation/core/images';

const Formality = React.createClass({

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
    slug: PropTypes.string.isRequired
  },

  shouldComponentUpdate: function(nextProps) {
    return anyPropsChanged(this.props.field.frequency, nextProps.field.frequency, ['touched', 'value']);
  },

  render: function() {
    const { field, id, images, name, slug } = this.props;

    const frequencyTags = FREQUENCIES.map(function(frequency, index) {
      const inputID = `${id}-${slug}-${frequency.slug}`;

      return (
        <li className="c--formality__frequency" key={index}>
          <input className="c--formality__frequency__input" id={inputID} type="radio" {...extractInputProps(field.frequency)} value={frequency.slug} checked={field.frequency.value === frequency.slug} />
          <label className="c--formality__frequency__label" htmlFor={inputID}>{frequency.name}</label>
        </li>
      );
    });

    return (
      <div className="c--formality">
        <div className="c--formality__details">
          <div className="c--formality__media">
            <img className="c--formality__media__image" src={images[0].path} srcSet={imageSizesToSrcset(images)} alt={name} {...imageSizesToDimensions(images, 120)} />
          </div>

          <fieldset className="c--formality__text">
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
