import { STYLES } from 'himation/ui/js/data/survey';

const defaultState = STYLES.map(function(style) {
  return {
    isSelected: false,
    slug: style.slug
  };
});

export default function styles(state = defaultState) {
  return state;
}
