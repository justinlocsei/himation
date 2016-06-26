'use strict';

var BuildError = require('himation/core/errors/build-error');
var ConfigurationError = require('himation/core/errors/configuration-error');
var DataError = require('himation/core/errors/data-error');

module.exports = {
  BuildError: BuildError,
  ConfigurationError: ConfigurationError,
  DataError: DataError
};
