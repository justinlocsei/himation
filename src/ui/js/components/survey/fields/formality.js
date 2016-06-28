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
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  },

  render: function() {
    const { field, id, name, slug } = this.props;

    const frequencyTags = FREQUENCIES.map(function(frequency, index) {
      const inputID = `${id}-${slug}-${frequency.slug}`;

      return (
        <li className="c--formality__frequency" key={index}>
          <input className="c--formality__frequency__input" id={inputID} type="radio" {...field.frequency} value={frequency.slug} checked={field.frequency.value === frequency.slug} />
          <label className="c--formality__frequency__label" htmlFor={inputID}>{frequency.name}</label>
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

        <input type="hidden" {...field.formality} />
      </div>
    );
  }

});

export default Formality;
