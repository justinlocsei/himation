import { FORMALITIES } from 'himation/ui/js/data/survey';
import { parseArrayField } from 'himation/core/extensions/redux-form';

const defaultState = FORMALITIES.map(function(formality) {
  return {
    frequency: null,
    slug: formality.slug
  };
});

export function parseForm(data) {
  const parsed = parseArrayField(data, 'formalities');

  return defaultState.map(function(formality) {
    const match = parsed.find(p => p.slug === formality.slug);
    return {
      ...formality,
      ...match
    };
  });
}

export default function formalities(state = defaultState) {
  return state;
}
