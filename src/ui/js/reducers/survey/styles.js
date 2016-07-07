import { parseArrayField } from 'himation/ui/js/extensions/redux-form';
import { STYLES } from 'himation/ui/js/data/survey';

const defaultState = STYLES.map(function(style) {
  return {
    isSelected: false,
    slug: style.slug
  };
});

export function parseForm(data) {
  const parsed = parseArrayField(data, 'styles', function(field, value) {
    return field === 'isSelected' ? !!value : value;
  });

  return defaultState.map(function(style) {
    const match = parsed.find(p => p.slug === style.slug);
    return {
      ...style,
      ...match
    };
  });
}

export default function styles(state = defaultState) {
  return state;
}
