import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import BirthYearPicker from './fields/birth-year-picker';
import BodyShapePicker from './fields/body-shape-picker';
import CareTypePicker from './fields/care-type-picker';
import Field from './field';
import FormalityPicker from './fields/formality-picker';
import SizePicker from './fields/size-picker';
import StylePicker from './fields/style-picker';
import { dismissSurveyErrors, flagSurveyErrors, submitSurvey } from 'himation/ui/actions/survey';
import { FORMALITIES, MAX_BIRTH_YEAR, MAX_STYLES, MAX_STYLES_WORD, MIN_BIRTH_YEAR } from 'himation/core/data/survey';
import { scrollToFirstError } from './error-message';

let Survey = React.createClass({

  propTypes: {
    failedValidation: PropTypes.bool,
    flagErrors: PropTypes.bool,
    form: PropTypes.object.isRequired,
    formAction: PropTypes.string.isRequired,
    formMethod: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool,
    onFlagErrors: PropTypes.func.isRequired,
    onServerSubmit: PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      failedValidation: false,
      flagErrors: false,
      isSubmitting: false
    };
  },

  componentWillMount: function() {
    if (this.props.failedValidation) {
      this.props.form.touchAll();
    }
  },

  componentDidUpdate: function() {
    if (this.props.flagErrors) {
      scrollToFirstError(this.props.onFlagErrors);
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

        <Field slug="formalities" title="How often do your male colleagues dress like this?">
          <FormalityPicker
            fields={fields.formalities}
            id="survey-formality"
          />
        </Field>

        <Field slug="styles" title="How do you want to be perceived at work?" help="Choose up to three styles">
          <StylePicker
            fields={fields.styles}
            id="survey-style"
            maxStyles={MAX_STYLES}
          />
        </Field>

        <Field slug="body-shape" title="What is your body shape?">
          <BodyShapePicker
            field={fields.bodyShape}
            id="survey-body-shape"
          />
        </Field>

        <Field slug="sizes" title="What sizes do you wear?" help="Select all sizes that you wear for at least one brand">
          <SizePicker
            fields={fields.sizes}
            id="survey-sizes"
          />
        </Field>

        <Field slug="care-types" title="How do you feel about delicate clothes?">
          <CareTypePicker
            fields={fields.careTypes}
            id="survey-care-types"
          />
        </Field>

        <Field slug="birth-year" title="How old are you?">
          <BirthYearPicker
            field={fields.birthYear}
            id="survey-birth-year"
          />
        </Field>

        <fieldset className="l--survey__buttons">
          <button className="l--survey__submit-button" type="submit" disabled={isSubmitting}>Show me what I need</button>
        </fieldset>

      </form>
    );
  }

});

function mapStateToProps(state) {
  const { survey } = state;

  return {
    failedValidation: survey.form.failedValidation,
    flagErrors: survey.form.flagErrors,
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
    onFlagErrors: function() {
      dispatch(dismissSurveyErrors());
    },
    onServerSubmit: function() {
      dispatch(submitSurvey());
    },
    onSubmitFail: function() {
      dispatch(flagSurveyErrors());
    }
  };
}

export function validate(values) {
  const errors = {};

  if (!values.birthYear) {
    errors.birthYear = 'Please provide your birth year';
  } else if (values.birthYear.match && values.birthYear.match(/[^0-9]/)) {
    errors.birthYear = 'Please use a numerical year';
  } else {
    const birthYear = parseInt(values.birthYear, 10);
    if (birthYear > MAX_BIRTH_YEAR || birthYear < MIN_BIRTH_YEAR) {
      errors.birthYear = 'Please provide a reasonable year';
    }
  }

  if (!values.bodyShape) {
    errors.bodyShape = 'Please select your body shape';
  }

  if (values.formalities) {
    const formalityErrors = values.formalities.reduce(function(previous, formality, index) {
      if (!formality.frequency) {
        const name = FORMALITIES.find(f => f.slug === formality.slug).name;
        previous[index] = `Please select how often your colleagues wear ${name.toLowerCase()}`;
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
    } else if (selectedStyles.length > MAX_STYLES) {
      errors.styles = [`Please select at most ${MAX_STYLES_WORD} styles`];
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
  onSubmit: function() {},
  propNamespace: 'form',
  validate: validate
}, mapStateToProps, mapDispatchToProps)(Survey);

export default Survey;
