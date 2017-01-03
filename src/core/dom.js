'use strict';

/**
 * Add a class to a DOM node's class attribute
 *
 * @param {string} className The class name to add
 * @param {Element} node A DOM node
 */
function addClass(className, node) {
  if (node.classList) {
    node.classList.add(className);
  } else {
    node.className += ' ' + className;
  }
}

module.exports = {
  addClass: addClass
};
