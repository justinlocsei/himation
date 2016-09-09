import { BEGIN_REGISTRATION, COMPLETE_REGISTRATION } from 'himation/ui/actions/registration';

const defaultState = {
  email: null,
  hasSaveError: false,
  isSubmitting: false,
  recommendationId: null
};

export default function registration(state = defaultState, action) {
  switch (action.type) {
    case BEGIN_REGISTRATION:
      return {
        ...state,
        isSubmitting: true
      };
    case COMPLETE_REGISTRATION:
      return {
        ...state,
        hasSaveError: action.error,
        isSubmitting: !action.error
      };
    default:
      return state;
  }
}
