import React, { PropTypes } from 'react';

import BirthYearPicker from './fields/birth-year-picker';
import BodyShapePicker from './fields/body-shape-picker';
import CareTypePicker from './fields/care-type-picker';
import FormalityPicker from './fields/formality-picker';
import Section from './section';
import SizePicker from './fields/size-picker';
import StylePicker from './fields/style-picker';

const Survey = React.createClass({

  propTypes: {
    formAction: PropTypes.string.isRequired,
    formMethod: PropTypes.string.isRequired
  },

  render: function() {
    const { formAction, formMethod } = this.props;

    return (
      <form className="c--survey" action={formAction} method={formMethod}>

        <Section name="Formality">
          <div className="c--survey__formalities">
            <FormalityPicker fieldID="survey-formality" fieldName="formalities" />
          </div>
        </Section>

        <Section name="Personal Information">
          <div className="c--survey__birth-year">
            <BirthYearPicker
              fieldID="survey-birth-year"
              fieldName="birth-year"
              rangeStart={1950}
              rangeEnd={new Date().getFullYear()}
            />
          </div>

          <div className="c--survey__shape">
            <BodyShapePicker fieldID="survey-body-shape" fieldName="body-shape" />
          </div>
        </Section>

        <Section name="Styles">
          <div className="c--survey__styles">
            <StylePicker fieldID="survey-style" fieldName="styles" />
          </div>
        </Section>

        <Section name="Garment Restrictions">
          <div className="c--survey__sizes">
            <SizePicker fieldID="survey-sizes" fieldName="sizes" />
          </div>

          <div className="c--survey__care">
            <CareTypePicker fieldID="survey-care-types" fieldName="care-types" />
          </div>
        </Section>

        <fieldset className="c--survey__buttons">
          <input className="c--survey__submit-button" type="submit" value="Make Recommendations" />
        </fieldset>

      </form>
    );
  }

});

export default Survey;
