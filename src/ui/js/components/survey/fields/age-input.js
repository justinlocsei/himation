import React, { PropTypes } from 'react';

const AgeInput = React.createClass({

  propTypes: {
    fieldID: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired
  },

  render: function() {
    const { fieldID, fieldName } = this.props;

    return (
      <div className="c--age-input">
        <label className="c--age-input__label" htmlFor={fieldID}>Age</label>
        <input className="c--age-input__input" type="number" name={fieldName} id={fieldID} />
      </div>
    );
  }

});

export default AgeInput;
