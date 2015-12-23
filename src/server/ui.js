'use strict';

/**
 * Require a UI module
 *
 * This requires a raw UI component from its file, and must be called by a file
 * that will be processed by webpack, to avoid having webpack's overloaded
 * `require` break a standard Node environment.
 *
 * @param {string} name The name of the UI module
 * @returns {object} The required module
 * @throws If the module cannot be found
 */
function requireModule(name) {
  return require('chiton/ui/js/' + name);
}

module.exports = {
  module: requireModule
};
