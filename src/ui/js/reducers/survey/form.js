import { DISMISS_SURVEY_ERRORS, FLAG_SURVEY_ERRORS, SUBMIT_SURVEY } from 'himation/ui/actions/survey';

const defaultState = {
  failedValidation: false,
  flagErrors: false,
  isSubmitting: false
};

export default function form(state = defaultState, action) {
  switch (action.type) {
    case DISMISS_SURVEY_ERRORS:
      return {
        ...state,
        flagErrors: false
      };
    case FLAG_SURVEY_ERRORS:
      return {
        ...state,
        flagErrors: true
      };
    case SUBMIT_SURVEY:
      return {
        ...state,
        isSubmitting: true
      };
    default:
      return state;
  }
}
