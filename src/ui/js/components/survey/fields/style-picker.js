import React, { PropTypes } from 'react';

export const STYLES = [
  {name: 'Caring, Empathetic', slug: 'caring-empathetic'},
  {name: 'Responsible, Trustworthy', slug: 'responsible-trustworthy'},
  {name: 'Classy, Elegant', slug: 'classy-elegant'},
  {name: 'Bold, Powerful', slug: 'bold-powerful'},
  {name: 'Creative, Fun', slug: 'creative-fun'},
  {name: 'Natural, Comfortable', slug: 'natural-comfortable'},
  {name: 'Sleek, Efficient', slug: 'sleek-efficient'}
];

const StylePicker = React.createClass({

  propTypes: {
    fields: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { fields, id } = this.props;

    const styleTags = fields.map(function(field, index) {
      const style = STYLES[index];
      const inputID = `${id}-${style.slug}`;

      return (
        <li className="c--style-picker__style" key={index}>
          <input className="c--style-picker__style__input" id={inputID} type="checkbox" {...field.isSelected} value={null} checked={field.isSelected.value} />
          <label className="c--style-picker__style__label" htmlFor={inputID}>{style.name}</label>
          <input type="hidden" {...field.style} />
        </li>
      );
    });

    return (
      <div className="c--style-picker">
        <fieldset className="c--style-picker__fields">
          <legend className="c--style-picker__fields__title">How do you want to be perceived?</legend>

          <ul className="c--style-picker__styles">
            {styleTags}
          </ul>
        </fieldset>
      </div>
    );
  }

});

export default StylePicker;
