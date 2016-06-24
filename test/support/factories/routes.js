'use strict';

/**
 * Produce a series of valid routes
 *
 * @param {object} extensions Data that will be applied to the defaults
 * @returns {HimationRoute[]}
 */
function routesFactory() {
  return [
    {guid: 'test', path: '/', method: 'get'}
  ];
}

module.exports = routesFactory;
