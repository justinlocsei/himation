import uniq from 'lodash/uniq';

import { COMPLETE_REGISTRATION } from 'himation/ui/actions/registration';
import { BANISH_REGISTRATION, DISMISS_REGISTRATION } from 'himation/ui/actions/registration-pitch';
import { VIEW_BASIC } from 'himation/ui/actions/recommendations';

const BASIC_THRESHOLD = 3;

export const defaultState = {
  isActive: false,
  isBanished: false,
  isComplete: false,
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
    case BANISH_REGISTRATION: {
      return {
        ...state,
        isActive: false,
        isBanished: true
      };
    }
    case DISMISS_REGISTRATION: {
      return {
        ...state,
        isActive: false,
        isDismissed: true
      };
    }
    case COMPLETE_REGISTRATION: {
      return {
        ...state,
        isComplete: !action.error
      };
    }
    default: {
      return state;
    }
  }
}
