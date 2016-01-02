'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Transform webpack build stats into Chiton stats
 *
 * @param {string} destination The path to the output directory
 * @param {webpack.Stats} stats A webpack build-stats object
 * @returns {ChitonBuildStats} Statistics on a Chiton build
 * @private
 */
function buildStats(destination, stats) {
  var source = stats.toJson({
    modules: false,
    reasons: false,
    timings: false,
    version: false
  });

  /**
   * Stats on a Chiton webpack build
   *
   * @typedef {object} ChitonBuildStats
   * @property {object} assets A mapping of chunk names to relative asset paths
   * @property {string} root The directory containing the assets
   * @property {string} url The URL at which the assets can be accessed
   */
  return {
    assets: source.assetsByChunkName,
    root: destination,
    url: source.publicPath
  };
}

/**
 * A webpack plugin to save minimal statistics on a build to a file
 *
 * @param {string} id The ID of the build
 * @param {string} directory The directory in which to save the file
 */
function BuildStatsPlugin(id, directory) {
  this.statsFile = BuildStatsPlugin.statsFile(id, directory);
}

/**
 * Product the path to the stats file that would be used for a named build
 *
 * @param {string} id The ID of the build
 * @param {string} directory The directory in which to save the file
 * @returns {[type]}
 */
BuildStatsPlugin.statsFile = function(id, directory) {
  return path.join(directory, id + '.json');
};

/**
 * Save the stats to a file when the build process completes
 *
 * @param {webpack.Compiler} compiler The webpack compiler
 */
BuildStatsPlugin.prototype.apply = function(compiler) {
  var statsFile = this.statsFile;

  compiler.plugin('done', function(stats) {
    var details = buildStats(compiler.outputPath, stats);
    fs.writeFileSync(statsFile, JSON.stringify(details, null, '  '));
  });
};

/**
 * Load the build statistics from the plugin's file
 *
 * @returns {ChitonBuildStats} Information on the build
 */
BuildStatsPlugin.prototype.loadStats = function() {
  return JSON.parse(fs.readFileSync(this.statsFile));
};

module.exports = BuildStatsPlugin;
