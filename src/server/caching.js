'use strict';

/**
 * Add headers to a response to make it cacheable by a gateway cache
 *
 * @param {express.Response} res A generated response
 * @param {number} ttl The number of seconds for which the gateway can store the response
 * @returns {express.Response} The modified response
 */
function allowGatewayCaching(res, ttl) {
  res.setHeader('Surrogate-Control', 'max-age=' + ttl);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.removeHeader('Expires');

  return res;
}

module.exports = {
  allowGatewayCaching: allowGatewayCaching
};
