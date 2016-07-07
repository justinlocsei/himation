import { CARE_TYPES } from 'himation/ui/js/data/survey';

const defaultState = CARE_TYPES.map(function(careType) {
  return {
    slug: careType.slug,
    isSelected: false
  };
});

export default function careTypes(state = defaultState) {
  return state;
}
