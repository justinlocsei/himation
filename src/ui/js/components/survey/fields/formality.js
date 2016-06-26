import React, { PropTypes } from 'react';

const FREQUENCIES = [
  {name: 'Never', slug: 'never'},
  {name: 'Occasionally', slug: 'rarely'},
  {name: '1-2 times per week', slug: 'sometimes'},
  {name: '3-4 times per week', slug: 'often'},
  {name: '5+ times per week', slug: 'always'}
];

const Formality = React.createClass({

  propTypes: {
    fieldID: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    frequency: PropTypes.string,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      frequency: 'never'
    };
  },

  render: function() {
    const { fieldID, fieldName, name, slug } = this.props;
    const selectedFrequency = this.props.frequency;

    const frequencyTags = FREQUENCIES.map(function(frequency, index) {
      const id = `${fieldID}-${slug}-${frequency.slug}`;
      const inputName = `${fieldName}[${slug}]`;

      return (
        <li className="c--formality__frequency" key={index}>
          <input className="c--formality__frequency__input" id={id} type="radio" name={inputName} value={frequency.slug} selected={frequency.slug === selectedFrequency} />
          <label className="c--formality__frequency__label" htmlFor={id}>{frequency.name}</label>
        </li>
      );
    });

    return (
      <div className="c--formality">
        <figure className="c--formality__example">
          <img className="c--formality__example__image" src={`https://placehold.it/200x250?text=${name}`} />
          <figcaption className="c--formality__example__caption">{name}</figcaption>
        </figure>

        <ul className="c--formality__frequencies">
          {frequencyTags}
        </ul>
      </div>
    );
  }

});

export default Formality;
