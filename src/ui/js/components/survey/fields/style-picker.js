import React, { PropTypes } from 'react';

const STYLES = [
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
    fieldID: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired
  },

  render: function() {
    const { fieldID, fieldName } = this.props;

    const styleTags = STYLES.map(function(style, index) {
      const id = `${fieldID}-${style.slug}`;

      return (
        <li className="c--style-picker__style" key={index}>
          <input className="c--style-picker__style__input" id={id} type="checkbox" name={fieldName} value={style.slug} />
          <label className="c--style-picker__style__label" htmlFor={id}>{style.name}</label>
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
