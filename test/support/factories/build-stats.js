'use strict';

var extend = require('extend');
var tmp = require('tmp');

/**
 * Produce a valid build-stats object
 *
 * @param {object} extensions Data that will be applied to the defaults
 * @returns {ChitonBuildStats}
 */
function buildStats(extensions) {
  var directory = tmp.dirSync().name;

  var defaults = {
    assets: {},
    entries: {},
    root: directory,
    path: '/'
  };

  return extend(true, {}, defaults, extensions || {});
}

module.exports = buildStats;
