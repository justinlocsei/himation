'use strict';

var crypto = require('crypto');

/**
 * Generate a random 32-bit integer as a string
 *
 * @returns {String}
 */
function randInt32() {
  return crypto.randomBytes(4).readUInt32BE(0, true).toString(10);
}

module.exports = {
  randInt32: randInt32
};
