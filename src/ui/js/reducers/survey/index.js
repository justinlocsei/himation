import { combineReducers } from 'redux';

import age from './age';
import bodyShape from './body-shape';
import careTypes from './care-types';
import formalities from './formalities';
import sizes from './sizes';
import styles from './styles';

export default combineReducers({
  age: age,
  bodyShape: bodyShape,
  careTypes: careTypes,
  formalities: formalities,
  sizes: sizes,
  styles: styles
});
