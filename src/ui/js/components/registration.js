import isEmail from 'validator/lib/isEmail';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import routes from 'himation/config/routes';
import { extractInputProps } from 'himation/core/extensions/redux-form';
import { guidToRoute } from 'himation/core/routing';
import { register } from 'himation/ui/actions/registration';
import { seedFields } from 'himation/core/extensions/redux-form';

const FORM_SCHEMA = ['email', 'recommendationId'];
const SUBMIT_ROUTE = guidToRoute(routes, 'himation.registration');

let Registration = React.createClass({

  propTypes: {
    form: PropTypes.object.isRequired,
    hasSaveError: PropTypes.bool,
    initialValues: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool,
    recommendationId: PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      hasSaveError: false,
      isSubmitting: false
    };
  },

  render: function() {
    const { form, hasSaveError, isSubmitting, recommendationId } = this.props;

    const emailField = form.fields.email;
    const isActive = emailField.active || emailField.visited;

    let errorMessage;
    let hasError = hasSaveError;
    if (hasSaveError) {
      errorMessage = 'Could not complete registration';
    } else if (emailField.touched && emailField.error) {
      errorMessage = emailField.error;
      hasError = true;
    }

    let errorTag;
    if (errorMessage) {
      errorTag = <p className="c--registration__error">{errorMessage}</p>;
    }

    const classes = ['c--registration'];
    if (isActive) { classes.push('is-active'); }
    if (hasError) { classes.push('is-invalid'); }

    return (
      <div className={classes.join(' ')}>
        <h3 className="c--registration__title">Bored by just looking at basic clothes?</h3>

        <div className="c--registration__content">
          <form className="c--registration__form" method={SUBMIT_ROUTE.method} action={SUBMIT_ROUTE.path} onSubmit={form.handleSubmit}>
            {errorTag}

            <label className="c--registration__email-label" htmlFor="email">Your Email Address</label>
            <input className="c--registration__email-input" type="email" id="email" placeholder={hasError ? 'email@example.com' : null} {...extractInputProps(emailField)} value={emailField.value || ''} />

            <button type="submit" className="c--registration__submit" disabled={isSubmitting}>
              {isSubmitting ? String.fromCharCode(8230) : 'Sign Up'}
            </button>

            <input type="hidden" name="recommendationId" value={recommendationId} />
          </form>

          <div className="c--registration__pitch">
            <p className="c--registration__pitch__text">Yeah, we know it’s boring, but having your basics covered is the difference between a closet that works and a closet that doesn’t.  It’s normal to not find everything you need after just one visit, but let’s be honest here.  You won’t remember to come back.  That’s why you should sign up for our email list.</p>
            <p className="c--registration__pitch__text">Don’t worry.  We don’t send emails every day &mdash; just once every month or two.  We’ll tell you about our latest featured clothes and remind you to check for any great basics to add to your closet.  That’s it.</p>
          </div>
        </div>
      </div>
    );
  }

});

function mapStateToFormProps(state) {
  const { recommendations, registration } = state;

  return {
    initialValues: {
      email: registration.email,
      recommendationId: recommendations.recommendationId
    }
  };
}

function mapDispatchToFormProps(dispatch) {
  return {
    onSubmit: function(data) {
      dispatch(register(SUBMIT_ROUTE.path, data));
    }
  };
}

function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'Please provide your email address';
  } else if (!isEmail(values.email)) {
    errors.email = 'Please provide a valid email address';
  }

  return errors;
}

function mapStateToComponentProps(state) {
  const { recommendations, registration } = state;

  return {
    hasSaveError: registration.hasSaveError,
    initialValues: seedFields(FORM_SCHEMA, registration, registration.errors),
    isSubmitting: registration.isSubmitting,
    recommendationId: recommendations.recommendationId
  };
}

Registration = connect(mapStateToComponentProps)(Registration);

Registration = reduxForm({
  form: 'registration',
  fields: FORM_SCHEMA,
  propNamespace: 'form',
  validate: validate
}, mapStateToFormProps, mapDispatchToFormProps)(Registration);

export default Registration;
