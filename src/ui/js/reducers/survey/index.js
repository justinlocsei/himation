import { combineReducers } from 'redux';

import birthYear from './birth-year';
import bodyShape from './body-shape';
import careTypes from './care-types';
import form from './form';
import formalities from './formalities';
import sizes from './sizes';
import styles from './styles';

export default combineReducers({
  birthYear: birthYear,
  bodyShape: bodyShape,
  careTypes: careTypes,
  form: form,
  formalities: formalities,
  sizes: sizes,
  styles: styles
});
