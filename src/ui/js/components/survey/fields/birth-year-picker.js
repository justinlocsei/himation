import React, { PropTypes } from 'react';

import ErrorMessage from 'himation/ui/components/survey/error-message';
import { anyPropsChanged } from 'himation/core/extensions/react';
import { extractInputProps } from 'himation/core/extensions/redux-form';

const BirthYearInput = React.createClass({

  propTypes: {
    field: PropTypes.object.isRequired,
    maxYear: PropTypes.number.isRequired,
    minYear: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  },

  shouldComponentUpdate: function(nextProps) {
    return anyPropsChanged(this.props.field, nextProps.field, ['error', 'touched', 'value']);
  },

  render: function() {
    const { field, id, maxYear, minYear } = this.props;

    let errorTag;
    if (field.touched && field.error) {
      errorTag = <ErrorMessage className="c--birth-year-picker__error">{field.error}</ErrorMessage>;
    }

    const classes = ['c--birth-year-picker'];
    if (errorTag) {
      classes.push('is-invalid');
    }

    return (
      <div className={classes.join(' ')}>
        <div className="c--birth-year-picker__field">
          <label className="c--birth-year-picker__label" htmlFor={id}>Enter your birth year</label>

          <div className="c--birth-year-picker__data">
            {errorTag}
            <input className="c--birth-year-picker__input" type="number" min={minYear} max={maxYear} id={id} {...extractInputProps(field)} value={field.value || ''} placeholder="YYYY" />
          </div>
        </div>
      </div>
    );
  }

});

export default BirthYearInput;
