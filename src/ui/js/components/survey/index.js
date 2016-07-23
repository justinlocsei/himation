import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import BirthYearPicker from './fields/birth-year-picker';
import BodyShapePicker from './fields/body-shape-picker';
import CareTypePicker from './fields/care-type-picker';
import Field from './field';
import FormalityPicker from './fields/formality-picker';
import SizePicker from './fields/size-picker';
import StylePicker from './fields/style-picker';
import { submitSurvey } from 'himation/ui/actions/survey';

let Survey = React.createClass({

  propTypes: {
    failedValidation: PropTypes.bool,
    form: PropTypes.object.isRequired,
    formAction: PropTypes.string.isRequired,
    formMethod: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool,
    onServerSubmit: PropTypes.func.isRequired
  },

  componentWillMount: function() {
    if (this.props.failedValidation) {
      this.props.form.touchAll();
    }
  },

  render: function() {
    const { form, formAction, formMethod, isSubmitting, onServerSubmit } = this.props;
    const { fields } = form;

    const handleSubmit = form.valid ? onServerSubmit : form.handleSubmit;

    const classes = ['l--survey'];
    if (isSubmitting) {
      classes.push('is-submitting');
    }

    return (
      <form className={classes.join(' ')} action={formAction} method={formMethod} onSubmit={handleSubmit}>

        <Field slug="formalities">
          <FormalityPicker
            fields={fields.formalities}
            id="survey-formality"
          />
        </Field>

        <Field slug="birth-year">
          <BirthYearPicker
            field={fields.birthYear}
            id="survey-birth-year"
            rangeEnd={new Date().getFullYear()}
            rangeStart={1950}
          />
        </Field>

        <Field slug="body-shape">
          <BodyShapePicker
            field={fields.bodyShape}
            id="survey-body-shape"
          />
        </Field>

        <Field slug="styles">
          <StylePicker
            fields={fields.styles}
            id="survey-style"
          />
        </Field>

        <Field slug="sizes">
          <SizePicker
            fields={fields.sizes}
            id="survey-sizes"
          />
        </Field>

        <Field slug="care-types">
          <CareTypePicker
            fields={fields.careTypes}
            id="survey-care-types"
          />
        </Field>

        <fieldset className="l--survey__buttons">
          <button className="l--survey__submit-button" type="submit" disabled={isSubmitting}>Make Recommendations</button>
        </fieldset>

      </form>
    );
  }

});

function mapStateToProps(state) {
  const { survey } = state;

  return {
    failedValidation: survey.form.failedValidation,
    initialValues: {
      birthYear: survey.birthYear,
      bodyShape: survey.bodyShape,
      careTypes: survey.careTypes,
      formalities: survey.formalities,
      sizes: survey.sizes,
      styles: survey.styles
    },
    isSubmitting: survey.form.isSubmitting
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onServerSubmit: function() {
      dispatch(submitSurvey());
    },
    onSubmit: function() {}
  };
}

export function validate(values) {
  const errors = {};

  if (!values.birthYear) {
    errors.birthYear = 'Please select your birth year';
  }

  if (!values.bodyShape) {
    errors.bodyShape = 'Please select your body shape';
  }

  if (values.formalities) {
    const formalityErrors = values.formalities.reduce(function(previous, formality, index) {
      if (!formality.frequency) {
        previous[index] = 'Please select a frequency';
      }
      return previous;
    }, []);

    if (formalityErrors.length) {
      errors.formalities = formalityErrors;
    }
  }

  if (values.styles) {
    const selectedStyles = values.styles.filter(style => style.isSelected);
    if (!selectedStyles.length) {
      errors.styles = ['Please select at least one style'];
    } else if (selectedStyles.length > 3) {
      errors.styles = ['Please select no more than three styles'];
    }
  }

  if (values.sizes) {
    const selectedSizes = values.sizes.filter(size => size.isSelected);
    if (!selectedSizes.length) {
      errors.sizes = ['Please select at least one size'];
    }
  }

  return errors;
}

Survey = reduxForm({
  form: 'survey',
  fields: [
    'birthYear',
    'bodyShape',
    'careTypes[]',
    'careTypes[].slug',
    'careTypes[].isSelected',
    'formalities[]',
    'formalities[].slug',
    'formalities[].frequency',
    'sizes[]',
    'sizes[].isSelected',
    'sizes[].slug',
    'styles[]',
    'styles[].isSelected',
    'styles[].slug'
  ],
  propNamespace: 'form',
  validate: validate
}, mapStateToProps, mapDispatchToProps)(Survey);

export default Survey;
