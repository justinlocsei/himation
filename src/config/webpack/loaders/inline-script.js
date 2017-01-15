'use strict';

/**
 * Wrap a script intended for inline use in a strict-mode IIFE
 *
 * @param {string} source The source of an inline script
 * @returns {string} The protected script
 */
function inlineScriptLoader(source) {
  this.cacheable();

  return [
    '(function() {',
    '"use strict;"',
    source,
    '})()'
  ].join('\n');
}

module.exports = inlineScriptLoader;
