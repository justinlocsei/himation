import { SUBMIT_SURVEY } from 'himation/ui/actions/survey';

const defaultState = {
  failedValidation: false,
  isSubmitting: false
};

export default function form(state = defaultState, action) {
  switch (action.type) {
    case SUBMIT_SURVEY:
      return {
        ...state,
        isSubmitting: true
      };
    default:
      return state;
  }
}
