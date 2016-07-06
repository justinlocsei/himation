import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import BirthYearPicker from './fields/birth-year-picker';
import BodyShapePicker from './fields/body-shape-picker';
import CareTypePicker, { CARE_TYPES } from './fields/care-type-picker';
import FormalityPicker, { FORMALITIES } from './fields/formality-picker';
import Section from './section';
import SizePicker, { SIZES } from './fields/size-picker';
import StylePicker, { STYLES } from './fields/style-picker';

const initialCareTypes = CARE_TYPES.map(function(careType) {
  return {
    careType: careType.slug,
    isSelected: false
  };
});

const initialFormalities = FORMALITIES.map(function(formality) {
  return {
    formality: formality.slug,
    frequency: null
  };
});

const initialSizes = SIZES.map(function(size) {
  return {
    isSelected: false,
    size: size.slug
  };
});

const initialStyles = STYLES.map(function(style) {
  return {
    isSelected: false,
    style: style.slug
  };
});

let Survey = React.createClass({

  propTypes: {
    form: PropTypes.object.isRequired,
    formAction: PropTypes.string.isRequired,
    formMethod: PropTypes.string.isRequired
  },

  render: function() {
    const { form, formAction, formMethod } = this.props;
    const { fields } = form;

    return (
      <form className="c--survey" action={formAction} method={formMethod} onSubmit={form.handleSubmit}>

        <Section name="Formality">
          <div className="c--survey__formalities">
            <FormalityPicker
              fields={fields.formalities}
              id="survey-formality"
            />
          </div>
        </Section>

        <Section name="Personal Information">
          <div className="c--survey__birth-year">
            <BirthYearPicker
              field={fields.birthYear}
              id="survey-birth-year"
              rangeEnd={new Date().getFullYear()}
              rangeStart={1950}
            />
          </div>

          <div className="c--survey__shape">
            <BodyShapePicker
              field={fields.bodyShape}
              id="survey-body-shape"
            />
          </div>
        </Section>

        <Section name="Styles">
          <div className="c--survey__styles">
            <StylePicker
              fields={fields.styles}
              id="survey-style"
            />
          </div>
        </Section>

        <Section name="Garment Restrictions">
          <div className="c--survey__sizes">
            <SizePicker
              fields={fields.sizes}
              id="survey-sizes"
            />
          </div>

          <div className="c--survey__care">
            <CareTypePicker
              fields={fields.careTypes}
              id="survey-care-types"
            />
          </div>
        </Section>

        <fieldset className="c--survey__buttons">
          <button className="c--survey__submit-button" type="submit" disabled={form.submitting}>Make Recommendations</button>
        </fieldset>

      </form>
    );
  }

});

function mapDispatchToProps() {
  return {
    onSubmit: function() {

    }
  };
}

function validate(values) {
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
    'careTypes[].careType',
    'careTypes[].isSelected',
    'formalities[]',
    'formalities[].formality',
    'formalities[].frequency',
    'sizes[]',
    'sizes[].isSelected',
    'sizes[].size',
    'styles[]',
    'styles[].isSelected',
    'styles[].style'
  ],
  initialValues: {
    careTypes: initialCareTypes,
    formalities: initialFormalities,
    sizes: initialSizes,
    styles: initialStyles
  },
  propNamespace: 'form',
  validate: validate
}, null, mapDispatchToProps)(Survey);

export default Survey;
