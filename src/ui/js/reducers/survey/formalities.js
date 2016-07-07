import { FORMALITIES } from 'himation/ui/js/data/survey';

const defaultState = FORMALITIES.map(function(formality) {
  return {
    frequency: null,
    slug: formality.slug
  };
});

export default function formalities(state = defaultState) {
  return state;
}
