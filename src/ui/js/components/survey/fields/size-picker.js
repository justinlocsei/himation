import React, { PropTypes } from 'react';

export const SIZES = [
  {name: 'XXS (0)', slug: 'xxs', rangeMin: 0, rangeMax: 0},
  {name: 'XS (2)', slug: 'xs', rangeMin: 2, rangeMax: 2},
  {name: 'S (4-6)', slug: 's', rangeMin: 4, rangeMax: 6},
  {name: 'M (8-10)', slug: 'm', rangeMin: 8, rangeMax: 10},
  {name: 'L (12-14)', slug: 'l', rangeMin: 12, rangeMax: 14},
  {name: 'XL (16-18)', slug: 'xl', rangeMin: 16, rangeMax: 18},
  {name: 'XXL (20-22)', slug: 'xxl', rangeMin: 20, rangeMax: 22},
  {name: 'Plus 1X (14-16)', slug: '1x-plus', rangeMin: 14, rangeMax: 16},
  {name: 'Plus 2X (18-20)', slug: '2x-plus', rangeMin: 18, rangeMax: 20},
  {name: 'Plus 3X (22-24)', slug: '3x-plus', rangeMin: 22, rangeMax: 24},
  {name: 'Plus 4X (26-28)', slug: '4x-plus', rangeMin: 26, rangeMax: 28},
  {name: 'Plus 5X (30-32)', slug: '5x-plus', rangeMin: 30, rangeMax: 32},
  {name: 'Petite XXS (0)', slug: 'xxs-petite', rangeMin: 0, rangeMax: 0},
  {name: 'Petite XS (2)', slug: 'xs-petite', rangeMin: 2, rangeMax: 2},
  {name: 'Petite S (4-6)', slug: 's-petite', rangeMin: 4, rangeMax: 6},
  {name: 'Petite M (8-10)', slug: 'm-petite', rangeMin: 8, rangeMax: 10},
  {name: 'Petite L (12-14)', slug: 'l-petite', rangeMin: 12, rangeMax: 14},
  {name: 'Petite XL (16-18)', slug: 'xl-petite', rangeMin: 16, rangeMax: 18},
  {name: 'Petite XXL (20-22)', slug: 'xxl-petite', rangeMin: 20, rangeMax: 22},
  {name: 'Tall XXS (0)', slug: 'xxs-tall', rangeMin: 0, rangeMax: 0},
  {name: 'Tall XS (2)', slug: 'xs-tall', rangeMin: 2, rangeMax: 2},
  {name: 'Tall S (4-6)', slug: 's-tall', rangeMin: 4, rangeMax: 6},
  {name: 'Tall M (8-10)', slug: 'm-tall', rangeMin: 8, rangeMax: 10},
  {name: 'Tall L (12-14)', slug: 'l-tall', rangeMin: 12, rangeMax: 14},
  {name: 'Tall XL (16-18)', slug: 'xl-tall', rangeMin: 16, rangeMax: 18},
  {name: 'Tall XXL (20-22)', slug: 'xxl-tall', rangeMin: 20, rangeMax: 22}
];

const SizePicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    const sizeTags = fields.map(function(field, index) {
      const size = SIZES[index];
      const inputID = `${id}-${size.slug}`;

      return (
        <li className="c--size-picker__size" key={index}>
          <input className="c--size-picker__size__input" id={inputID} type="checkbox" {...field.isSelected} value={null} checked={field.isSelected.value} />
          <label className="c--size-picker__size__label" htmlFor={inputID}>{size.name}</label>
          <input type="hidden" {...field.size} />
        </li>
      );
    });

    return (
      <div className="c--size-picker">
        <fieldset className="c--size-picker__fields">
          <legend className="c--size-picker__fields__title">Which sizes do you wear?</legend>

          <ul className="c--size-picker__sizes">
            {sizeTags}
          </ul>
        </fieldset>
      </div>
    );
  }

});

export default SizePicker;
