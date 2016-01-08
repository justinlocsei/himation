'use strict';

var extend = require('extend');
var tmp = require('tmp');

/**
 * Produce a valid build-manifest object
 *
 * @param {object} extensions Data that will be applied to the defaults
 * @returns {ChitonBuildManifest}
 */
function buildManifest(extensions) {
  var directory = tmp.dirSync().name;

  var defaults = {
    assets: {},
    entries: {},
    root: directory,
    path: '/'
  };

  return extend(true, {}, defaults, extensions || {});
}

module.exports = buildManifest;
