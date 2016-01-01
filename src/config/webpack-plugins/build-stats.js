'use strict';

var fs = require('fs');
var path = require('path');

/**
 * A webpack plugin to save minimal statistics on a build to a file
 *
 * @param {string} id The ID of the build
 * @param {string} directory The directory in which to save the file
 */
function BuildStatsPlugin(id, directory) {
  this.statsFile = path.join(directory, id + '.json');
}

/**
 * Save the stats to a file when the build process completes
 *
 * @param {webpack.Compiler} compiler The webpack compiler
 */
BuildStatsPlugin.prototype.apply = function(compiler) {
  var statsFile = this.statsFile;

  compiler.plugin('done', function(stats) {
    var details = stats.toJson({
      modules: false,
      reasons: false,
      timings: false,
      version: false
    });

    fs.writeFileSync(statsFile, JSON.stringify(details, null, '  '));
  });
};

module.exports = BuildStatsPlugin;
