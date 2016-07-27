import React, { PropTypes } from 'react';

const BirthYearInput = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  },

  render: function() {
    const { field, id } = this.props;

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

        <div className="c--birth-year-picker__field">
          <label className="c--birth-year-picker__label" htmlFor={id}>Enter your birth year</label>
          <input className="c--birth-year-picker__input" type="number" id={id} {...field} value={field.value || ''} placeholder="YYYY" />
        </div>
      </div>
    );
  }

});

export default BirthYearInput;
