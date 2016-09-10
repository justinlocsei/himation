import uniq from 'lodash/uniq';

import { DISMISS_REGISTRATION, VIEW_BASIC } from 'himation/ui/actions/pitch';

const BASIC_PITCH_THRESHOLD = 4;

const defaultState = {
  isActive: false,
  isDismissed: false,
  viewedBasics: []
};

export default function pitch(state = defaultState, action) {
  switch (action.type) {
    case VIEW_BASIC: {
      const viewed = uniq(state.viewedBasics.concat([action.payload.slug]));
      return {
        ...state,
        isActive: !state.isDismissed && viewed.length >= BASIC_PITCH_THRESHOLD,
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
