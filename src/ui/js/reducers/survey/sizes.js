import { SIZES } from 'himation/ui/js/data/survey';

const defaultState = SIZES.map(function(size) {
  return {
    isSelected: false,
    slug: size.slug
  };
});

export default function sizes(state = defaultState) {
  return state;
}
