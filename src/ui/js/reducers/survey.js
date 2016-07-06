import { SUBMIT_SURVEY } from 'himation/ui/js/actions/survey';

const defaultState = {
  isSubmitting: false
};

export default function survey(state = defaultState, action) {
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
