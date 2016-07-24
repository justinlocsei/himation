import React, { PropTypes } from 'react';
import { range } from 'lodash';

const BirthYearInput = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    rangeEnd: PropTypes.number.isRequired,
    rangeStart: PropTypes.number.isRequired
  },

  render: function() {
    const { field, id, rangeEnd, rangeStart } = this.props;

    const options = range(rangeStart, rangeEnd).map(function(year) {
      return <option value={year} key={year}>{year}</option>;
    });

    let errorTag;
    if (field.touched && field.error) {
      errorTag = <p className="c--birth-year-picker__error">{field.error}</p>;
    }

    const classes = ['c--birth-year-picker'];
    if (errorTag) {
      classes.push('is-invalid');
    }

    return (
      <div className={classes.join(' ')}>
        {errorTag}
        <label className="c--birth-year-picker__label" htmlFor={id}>Select a year</label>
        <select className="c--birth-year-picker__years" id={id} {...field} value={field.value || ''}>
          <option></option>
          {options}
        </select>
      </div>
    );
  }

});

export default BirthYearInput;
