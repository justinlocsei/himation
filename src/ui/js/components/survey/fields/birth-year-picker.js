import React, { PropTypes } from 'react';
import { range } from 'lodash';

const BirthYearInput = React.createClass({

  propTypes: {
    fieldID: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    rangeEnd: PropTypes.number.isRequired,
    rangeStart: PropTypes.number.isRequired
  },

  render: function() {
    const { fieldID, fieldName, rangeEnd, rangeStart } = this.props;

    const options = range(rangeStart, rangeEnd).map(function(year) {
      return <option value={year} key={year}>{year}</option>;
    });

    return (
      <div className="c--birth-year-picker">
        <label className="c--birth-year-picker__label" htmlFor={fieldID}>Birth Year</label>
        <select className="c--birth-year-picker__years" name={fieldName} id={fieldID}>
          <option>----</option>
          {options}
        </select>
      </div>
    );
  }

});

export default BirthYearInput;
