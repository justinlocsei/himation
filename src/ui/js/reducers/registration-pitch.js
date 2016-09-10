import uniq from 'lodash/uniq';

import { DISMISS_REGISTRATION } from 'himation/ui/actions/registration-pitch';
import { VIEW_BASIC } from 'himation/ui/actions/recommendations';

const BASIC_THRESHOLD = 4;

const defaultState = {
  isActive: false,
  isDismissed: false,
  viewedBasics: []
};

export default function registrationPitch(state = defaultState, action) {
  switch (action.type) {
    case VIEW_BASIC: {
      const viewed = uniq(state.viewedBasics.concat([action.payload.slug]));
      return {
        ...state,
        isActive: !state.isDismissed && viewed.length >= BASIC_THRESHOLD,
        viewedBasics: viewed
      };
    }
    case DISMISS_REGISTRATION: {
      return {
        ...state,
        isActive: false,
        isDismissed: true
      };
    }
    default: {
      return state;
    }
  }
}
