'use strict';

/**
 * Capitalize the first letter in a word or phrase
 *
 * @param {string} text Text to capitalize
 * @returns {string} The text with the first letter capitalized
 */
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports = {
  capitalize: capitalize
};
