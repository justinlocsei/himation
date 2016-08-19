'use strict';

var StatsD = require('hot-shots');

/**
 * Get the current timestamp in milliseconds
 *
 * @returns {integer}
 * @private
 */
function getTimestamp() {
  return new Date().getTime();
}

/**
 * Create a middleware function that tracks application stats via statsD
 *
 * @param {boolean} report Whether to report stats to the statsD server
 * @returns {function} The tracker middleware
 */
function create(report) {
  var client = new StatsD({
    mock: !report,
    prefix: 'himation.'
  });

  return function(req, res, next) {
    if (!req._startTime) {
      req._startTime = getTimestamp();
    }

    var originalEnd = res.end;
    res.end = function(chunk, encoding) {
      res.end = originalEnd;
      res.end(chunk, encoding);

      var tags = [
        'path:' + req.path,
        'status:' + res.statusCode
      ];

      client.increment('status.' + res.statusCode, 1, tags);
      client.increment('status.all', 1, tags);

      if (req._startTime) {
        client.histogram('time', getTimestamp() - req._startTime, 1, tags);
      }
    };

    next();
  };
}

module.exports = {
  create: create
};
