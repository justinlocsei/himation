import { parseArrayField } from 'himation/ui/js/extensions/redux-form';
import { SIZES } from 'himation/ui/js/data/survey';

const defaultState = SIZES.map(function(size) {
  return {
    isSelected: false,
    slug: size.slug
  };
});

export function parseForm(data) {
  const parsed = parseArrayField(data, 'sizes', function(field, value) {
    return field === 'isSelected' ? !!value : value;
  });

  return defaultState.map(function(size) {
    const match = parsed.find(p => p.slug === size.slug);
    return {
      ...size,
      ...match
    };
  });
}

export default function sizes(state = defaultState) {
  return state;
}
