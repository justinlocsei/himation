'use strict';

/**
 * Render HTML with a valid doctype
 *
 * @param {string} markup Existing HTML markup
 * @returns {string} The markup with a valid doctype
 */
function renderHtml(markup) {
  return '<!doctype html>\n' + markup;
}

module.exports = {
  renderHtml: renderHtml
};
