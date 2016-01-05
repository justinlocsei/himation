'use strict';

var _ = require('lodash');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var fs = require('fs');
var path = require('path');

/**
 * Stats on a Chiton webpack build
 *
 * @typedef {object} ChitonBuildStats
 * @property {object} assets A mapping of chunk names to relative asset paths
 * @property {object} entries A mapping of entry point names to output paths
 * @property {string} root The directory containing the assets
 * @property {string} url The URL at which the assets can be accessed
 */

/**
 * Convert all placeholders in an entry point's file name into concrete values
 *
 * @param {string} entry The name of the entry point
 * @param {string} filename The filename template for an entry point
 * @param {object} stats Information on a webpack build
 * @returns {string} The final name of the entry point's file
 */
function resolveEntry(entry, filename, stats) {
  var subs = {
    hash: stats.hash,
    name: entry
  };

  var entryChunk = _.find(stats.chunks, function(chunk) {
    return chunk.names.indexOf(entry) !== -1;
  });

  if (entryChunk) {
    subs.chunkhash = entryChunk.hash;
  }

  return Object.keys(subs).reduce(function(template, sub) {
    return template.replace('[' + sub + ']', subs[sub]);
  }, filename);
}

/**
 * Produce a list of all file dependencies for a
 *
 * This is used to fetch any assets associated with the entry point that are
 * stored in a commons chunk.
 *
 * @param {string} entry The name of the entry point
 * @param {object} config The webpack configuration file that produced the build
 * @param {object} stats Information on a webpack build
 * @returns {string} The final name of the entry point's file
 */
function dependentFiles(entry, config, stats) {
  var commons = (config.plugins || []).filter(function(plugin) {
    return plugin.constructor === CommonsChunkPlugin;
  });

  return commons.reduce(function(files, plugin) {
    if (!plugin.selectedChunks || plugin.selectedChunks.indexOf(entry) !== -1) {
      return files.concat(stats.assetsByChunkName[plugin.chunkNames]);
    } else {
      return files;
    }
  }, []);
}

/**
 * Transform webpack build stats into Chiton stats
 *
 * @param {object} config The webpack configuration file that produced the build
 * @param {webpack.Stats} stats A webpack build-stats object
 * @returns {ChitonBuildStats} Statistics on a Chiton build
 * @private
 */
function buildStats(config, stats) {
  var source = stats.toJson({
    reasons: false,
    timings: false,
    version: false
  });

  var assets = Object.keys(source.assetsByChunkName).reduce(function(chunks, chunk) {
    var files = source.assetsByChunkName[chunk];
    if (_.isString(files)) { files = [files]; }
    chunks[chunk] = dependentFiles(chunk, config, source).concat(files);
    return chunks;
  }, {});

  var entries = Object.keys(assets).reduce(function(points, entry) {
    var compiled = resolveEntry(entry, config.output.filename, source);
    points[entry] = path.join(config.output.path, compiled);
    return points;
  }, {});

  return {
    assets: assets,
    entries: entries,
    root: config.output.path,
    path: source.publicPath
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
 * Produce the path to the stats file that would be used for a named build
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
    var details = buildStats(compiler.options, stats);
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
