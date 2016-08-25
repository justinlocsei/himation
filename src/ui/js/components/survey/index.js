import isEmpty from 'lodash/isEmpty';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import BirthYearPicker from './fields/birth-year-picker';
import BodyShapePicker from './fields/body-shape-picker';
import CareTypePicker from './fields/care-type-picker';
import Field from './field';
import FormalityPicker from './fields/formality-picker';
import SizePicker from './fields/size-picker';
import StylePicker from './fields/style-picker';
import { convertPostDataToProfile } from 'himation/server/data/survey';
import { dismissSurveyErrors, flagSurveyErrors, submitSurvey } from 'himation/ui/actions/survey';
import { MAX_BIRTH_YEAR, MAX_STYLES, MAX_STYLES_WORD, MIN_BIRTH_YEAR } from 'himation/core/data/survey';
import { scrollToFirstError } from './error-message';
import { seedFields } from 'himation/core/extensions/redux-form';

const HONEYPOT_FIELD = 'email';

const FORM_SCHEMA = [
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
];

let Survey = React.createClass({

  propTypes: {
    anchorId: PropTypes.string,
    failedValidation: PropTypes.bool,
    flagErrors: PropTypes.bool,
    form: PropTypes.object.isRequired,
    formAction: PropTypes.string.isRequired,
    formMethod: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
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
    this._dom = {};

    if (this.props.failedValidation) {
      this.props.form.touchAll();
    }
  },

  // Derive the internal redux-form state from the form's DOM
  //
  // This only occurs when the form is not being seeded with a non-default
  // state, as is the case when the user validated the form via an HTTP request
  // instead of client logic.  This serializes the form and converts that data
  // to an object that can be used to initialize the redux form.
  //
  // The goal of all of this is to ensure that, if a user arrives at the form
  // by hitting the back button, browsers that remember the user's selection
  // will not be reset when the user changes a value on the form, due to an
  // internal empty state for redux form.
  componentDidMount: function() {
    if (this.props.failedValidation) { return; }

    const postData = this._extractPostData(this._dom.form);
    const profile = convertPostDataToProfile(postData);
    this.props.form.initializeForm(profile);
  },

  componentDidUpdate: function() {
    if (this.props.flagErrors) {
      scrollToFirstError(this.props.onFlagErrors);
    }
  },

  render: function() {
    const { anchorId, form, formAction, formMethod, isSubmitting, onServerSubmit } = this.props;

    const dom = this._dom;
    const handleSubmit = form.valid ? onServerSubmit : form.handleSubmit;

    return (
      <form className="l--survey" id={anchorId} action={formAction} method={formMethod} onSubmit={handleSubmit} ref={function(el) { dom.form = el; }}>

        <h2 className="l--survey__title">Tell Us About Yourself</h2>

        <Field slug="formalities" title="How often do your male colleagues dress like this?">
          <FormalityPicker
            fields={this._getFieldData('formalities')}
            id="survey-formality"
          />
        </Field>

        <Field slug="styles" title="How do you want to be perceived at work?" help="Choose up to three styles">
          <StylePicker
            fields={this._getFieldData('styles')}
            id="survey-style"
            maxStyles={MAX_STYLES}
          />
        </Field>

        <Field slug="body-shape" title="What is your body shape?">
          <BodyShapePicker
            field={this._getFieldData('bodyShape')}
            id="survey-body-shape"
          />
        </Field>

        <Field slug="sizes" title="What sizes do you wear?">
          <SizePicker
            fields={this._getFieldData('sizes')}
            id="survey-sizes"
          />
        </Field>

        <Field slug="care-types" title="How do you feel about delicate clothes?">
          <CareTypePicker
            fields={this._getFieldData('careTypes')}
            id="survey-care-types"
          />
        </Field>

        <Field slug="birth-year" title="How old are you?">
          <BirthYearPicker
            field={this._getFieldData('birthYear')}
            maxYear={MAX_BIRTH_YEAR}
            minYear={MIN_BIRTH_YEAR}
            id="survey-birth-year"
          />
        </Field>

        <Field slug="email" title="What is your email address?">
          <p>
            <label htmlFor="survey-email">Please leave this field blank</label>
            <input id="survey-email" name={HONEYPOT_FIELD} />
          </p>
        </Field>

        <fieldset className="l--survey__buttons">
          <button className="l--survey__submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? `Loading${String.fromCharCode(8230)}` : 'Show me what I need'}
          </button>
        </fieldset>

      </form>
    );
  },

  _getFieldData: function(fieldName) {
    const fields = this.props.form.fields;
    const initialValues = this.props.initialValues;

    const hasData = fields.formalities.length > 0;
    return hasData ? fields[fieldName] : initialValues[fieldName];
  },

  /**
   * Convert the form's field selections into a hash of POST data
   *
   * @param {Element} form The form's DOM element
   * @returns {object} A mapping of field names to serialized values
   */
  _extractPostData: function(form) {
    const data = {};

    const inputs = form.querySelectorAll('input');
    const inputCount = inputs.length;

    for (let i = 0; i < inputCount; i++) {
      const input = inputs[i];
      let value;

      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.value === 'false' || input.value === 'true') {
          value = input.checked ? 'true' : '';
        } else if (input.checked) {
          value = input.value;
        }
      } else if (input.value) {
        value = input.value;
      }

      if (value !== undefined) {
        data[input.name] = value;
      }
    }

    return data;
  }

});

function mapStateToFormProps(state) {
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

function mapDispatchToFormProps(dispatch) {
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

/**
 * Determine whether a survey submission appears to be spam
 *
 * This uses the presence of a value for the honeypot field as the check.
 *
 * @param {object} data The form's raw POST data
 * @returns {boolean} Whether the submission appears to be spam
 */
export function isSpamSubmission(data) {
  return !isEmpty(data[HONEYPOT_FIELD]);
}

function mapStateToSurveyProps(state) {
  const { survey } = state;

  return {
    initialValues: seedFields(FORM_SCHEMA, survey, survey.errors)
  };
}

Survey = connect(mapStateToSurveyProps)(Survey);

Survey = reduxForm({
  form: 'survey',
  fields: FORM_SCHEMA,
  onSubmit: function() {},
  propNamespace: 'form',
  validate: validate
}, mapStateToFormProps, mapDispatchToFormProps)(Survey);

export default Survey;
