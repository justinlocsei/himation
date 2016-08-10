import { combineReducers } from 'redux';

import birthYear, { parseForm as parseBirthYear } from './birth-year';
import bodyShape, { parseForm as parseBodyShape } from './body-shape';
import careTypes, { parseForm as parseCareTypes } from './care-types';
import errors from './errors';
import form from './form';
import formalities, { parseForm as parseFormalities } from './formalities';
import sizes, { parseForm as parseSizes } from './sizes';
import styles, { parseForm as parseStyles } from './styles';

const formParsers = {
  birthYear: parseBirthYear,
  bodyShape: parseBodyShape,
  careTypes: parseCareTypes,
  formalities: parseFormalities,
  sizes: parseSizes,
  styles: parseStyles
};

/**
 * Convert POST data for the survey form into the survey state shape
 *
 * @param {object} data POST data for the form
 * @returns {object} The data converted to a state shape
 */
export function convertPostDataToStateShape(data) {
  return Object.keys(formParsers).reduce(function(state, field) {
    state[field] = formParsers[field](data);
    return state;
  }, {});
}

export default combineReducers({
  birthYear: birthYear,
  bodyShape: bodyShape,
  careTypes: careTypes,
  errors: errors,
  form: form,
  formalities: formalities,
  sizes: sizes,
  styles: styles
});
