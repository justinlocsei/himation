'use strict';

var extend = require('extend');
var Joi = require('Joi');

var errors = require('himation/core/errors');

/**
 * Himation server settings
 *
 * @typedef {object} HimationServerSettings
 * @property {string} host The hostname for the server
 * @property {number} port The port for the server
 * @property {string} protocol The protocol for the server
 */

/**
 * Himation environment settings
 *
 * @typedef {object} HimationSettings
 * @property {object} assets Asset configuration information
 * @property {boolean} assets.debug Whether to bundle assets in debug mode
 * @property {boolean} assets.optimize Whether to optimize all bundled assets
 * @property {boolean} debug Whether to run in debugging mode
 * @property {object} server Settings for the server
 * @property {boolean} server.debugLogging Whether to use a debugging-friendly log format
 * @property {object} servers Addresses for all known servers
 * @property {HimationServerSettings} servers.app Address components for the application server
 * @property {HimationServerSettings} servers.assets Address components for the assets server
 */
var defaults = {
  assets: {
    debug: false,
    optimize: false
  },
  server: {
    debugLogging: false
  },
  servers: {
    app: {
      host: 'localhost',
      port: 80,
      protocol: 'http'
    },
    assets: {
      host: 'localhost',
      port: 80,
      protocol: 'http'
    }
  }
};

// The schema for server settings
var serverSchema = Joi.object().keys({
  host: Joi.string(),
  port: Joi.number(),
  protocol: Joi.string()
});

// The schema for the settings
var schema = Joi.object().keys({
  assets: Joi.object().keys({
    debug: Joi.boolean(),
    optimize: Joi.boolean()
  }),
  server: Joi.object().keys({
    debugLogging: Joi.boolean()
  }),
  servers: Joi.object().keys({
    app: serverSchema,
    assets: serverSchema
  })
});

/**
 * Create custom settings by merging the given settings with the defaults
 *
 * @param {object} custom Custom settings to merge with the default settings
 * @returns {HimationSettings} The custom settings
 * @throws {ConfigurationError} If the settings are invalid
 */
function build(custom) {
  var settings = extend(true, {}, defaults, custom || {});

  var validation = Joi.validate(settings, schema, {
    convert: false,
    presence: 'required'
  });

  if (validation.error) {
    throw new errors.ConfigurationError(validation.error.annotate());
  }

  return settings;
}

module.exports = {
  build: build
};
