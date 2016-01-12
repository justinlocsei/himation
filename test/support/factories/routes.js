'use strict';

/**
 * Produce a series of valid routes
 *
 * @param {object} extensions Data that will be applied to the defaults
 * @returns {ChitonRoute[]}
 */
function routes() {
  return [
    {guid: 'test', path: '/', method: 'get'}
  ];
}

module.exports = routes;
