'use strict';

var parseArrayField = require('himation/core/extensions/redux-form').parseArrayField;
var surveyData = require('himation/core/data/survey');

/**
 * Normalized survey data
 *
 * @typedef {object} HimationSurveyData
 * @property {number} birthYear The user's year of birth
 * @property {string} bodyShape The slug of the user's body shape
 * @property {object[]} careTypes All selected care types
 * @property {boolean} careTypes.isSelected Whether the care type is selected
 * @property {string} careTypes.slug The slug of the care type
 * @property {object[]} formalities All selected formalities
 * @property {string} formalities.frequency The slug of the formality's frequency
 * @property {string} formalities.slug The slug of the formality
 * @property {object[]} sizes All selected sizes
 * @property {boolean} sizes.isSelected Whether the size is selected
 * @property {string} sizes.slug The slug of the size
 * @property {object[]} styles All selected styles
 * @property {boolean} styles.isSelected Whether the style is selected
 * @property {string} styles.slug The slug of the style
 */

/**
 * Convert the birth year to a number
 *
 * @param {object} data POST data for the survey
 * @returns {number}
 * @private
 */
function parseBirthYear(data) {
  return parseInt(data.birthYear, 10);
}

/**
 * Treat the body shape as a string
 *
 * @param {object} data POST data for the survey
 * @returns {string}
 * @private
 */
function parseBodyShape(data) {
  return data.bodyShape;
}

/**
 * Combine selected care types with the default data
 *
 * @param {object} data POST data for the survey
 * @returns {object[]}
 * @private
 */
function parseCareTypes(data) {
  var parsed = parseArrayField(data, 'careTypes', function(field, value) {
    return field === 'isSelected' ? !!value : value;
  });

  return surveyData.CARE_TYPES.map(function(careType) {
    var match = parsed.find(p => p.slug === careType.slug);
    return match || {
      slug: careType.slug,
      isSelected: false
    };
  });
}

/**
 * Combine formalities with the default data
 *
 * @param {object} data POST data for the survey
 * @returns {object[]}
 * @private
 */
function parseFormalities(data) {
  var parsed = parseArrayField(data, 'formalities');

  return surveyData.FORMALITIES.map(function(formality) {
    var match = parsed.find(p => p.slug === formality.slug);
    return match || {
      frequency: null,
      slug: formality.slug
    };
  });
}

/**
 * Combine sizes with the default data
 *
 * @param {object} data POST data for the survey
 * @returns {object[]}
 * @private
 */
function parseSizes(data) {
  var parsed = parseArrayField(data, 'sizes', function(field, value) {
    return field === 'isSelected' ? !!value : value;
  });

  return surveyData.SIZES.map(function(size) {
    var match = parsed.find(p => p.slug === size.slug);
    return match || {
      isSelected: false,
      slug: size.slug
    };
  });
}

/**
 * Combine styles with the default data
 *
 * @param {object} data POST data for the survey
 * @returns {object[]}
 * @private
 */
function parseStyles(data) {
  var parsed = parseArrayField(data, 'styles', function(field, value) {
    return field === 'isSelected' ? !!value : value;
  });

  return surveyData.STYLES.map(function(style) {
    var match = parsed.find(p => p.slug === style.slug);
    return match || {
      isSelected: false,
      slug: style.slug
    };
  });
}

// A mapping of form fields to parsers
var formParsers = {
  birthYear: parseBirthYear,
  bodyShape: parseBodyShape,
  careTypes: parseCareTypes,
  formalities: parseFormalities,
  sizes: parseSizes,
  styles: parseStyles
};

/**
 * Convert POST data for the survey form into normalized survey data
 *
 * @param {object} data POST data for the survey form
 * @returns {HimationSurveyData} The normalized survey data
 */
function convertPostDataToProfile(data) {
  return Object.keys(formParsers).reduce(function(survey, field) {
    survey[field] = formParsers[field](data);
    return survey;
  }, {});
}

module.exports = {
  convertPostDataToProfile: convertPostDataToProfile
};
