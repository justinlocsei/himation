import { CARE_TYPES } from 'himation/ui/js/data/survey';
import { parseArrayField } from 'himation/ui/js/extensions/redux-form';

const defaultState = CARE_TYPES.map(function(careType) {
  return {
    slug: careType.slug,
    isSelected: false
  };
});

export function parseForm(data) {
  const parsed = parseArrayField(data, 'careTypes', function(field, value) {
    return field === 'isSelected' ? !!value : value;
  });

  return defaultState.map(function(careType) {
    const match = parsed.find(p => p.slug === careType.slug);
    return {
      ...careType,
      ...match
    };
  });
}

export default function careTypes(state = defaultState) {
  return state;
}
