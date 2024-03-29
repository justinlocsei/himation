import debounce from 'lodash/debounce';

// A flag for whether the resize handler has been registered
let handlerRegistered = false;

// A singleton collection of all registered resize handlers
let resizeHandlers = [];

/**
 * Add a handler that responds to the resize event
 *
 * @param {function} handler The resize handler
 */
export function addResizeHandler(handler) {
  if (!handlerRegistered) {
    registerSingletonResizeHandler();
    handlerRegistered = true;
  }

  if (resizeHandlers.indexOf(handler) === -1) {
    resizeHandlers.push(handler);
  }
}

/**
 * Remove a resize handler
 *
 * @param {function} handler A registered resize handler
 */
export function removeResizeHandler(handler) {
  resizeHandlers = resizeHandlers.filter(registered => registered !== handler);
}

/**
 * Register the singleton resize handler as a debounced listener
 *
 * @private
 */
function registerSingletonResizeHandler() {
  window.addEventListener('resize', debounce(onResize, 50));
}

/**
 * Call each registered resize handler in response to a resize event
 *
 * @private
 */
function onResize() {
  resizeHandlers.forEach(function(handler) {
    handler();
  });
}
