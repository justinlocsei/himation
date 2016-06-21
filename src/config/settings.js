'use strict';

var extend = require('extend');
var Joi = require('joi');

var errors = require('himation/core/errors');

/**
 * Himation server settings
 *
 * @typedef {object} HimationServerSettings
 * @property {string} binding The address on which to bind the server
 * @property {string} host The hostname for the server
 * @property {string} path The path for the server's root URL
 * @property {number} port The port for the server
 * @property {string} protocol The protocol for the server
 */
var serverSchema = Joi.object().keys({
  binding: Joi.string(),
  host: Joi.string(),
  path: Joi.string(),
  port: Joi.number(),
  protocol: Joi.string()
});

/**
 * Himation environment settings
 *
 * @typedef {object} HimationSettings
 * @property {object} assets Asset configuration information
 * @property {string} assets.buildDir The absolute path to the directory containing transient build files
 * @property {boolean} assets.debug Whether to bundle assets in debug mode
 * @property {string} assets.distDir The absolute path to the directory containing optimized assets
 * @property {boolean} assets.optimize Whether to optimize all bundled assets
 * @property {boolean} debug Whether to run in debugging mode
 * @property {object} server Settings for the server
 * @property {boolean} server.debugLogging Whether to use a debugging-friendly log format
 * @property {object} servers Addresses for all known servers
 * @property {HimationServerSettings} servers.app Address components for the application server
 * @property {HimationServerSettings} servers.assets Address components for the assets server
 */
var schema = Joi.object().keys({
  assets: Joi.object().keys({
    buildDir: Joi.string(),
    debug: Joi.boolean(),
    distDir: Joi.string(),
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

var defaults = {
  assets: {
    buildDir: undefined,
    debug: false,
    distDir: undefined,
    optimize: false
  },
  server: {
    debugLogging: false
  },
  servers: {
    app: {
      binding: 'localhost',
      host: 'localhost',
      path: '/',
      port: 80,
      protocol: 'http'
    },
    assets: {
      binding: 'localhost',
      host: 'localhost',
      path: '/',
      port: 80,
      protocol: 'http'
    }
  }
};

/**
 * Create custom settings by merging the given settings with the defaults
 *
 * @param {object} custom Custom settings to merge with the default settings
 * @returns {HimationSettings} The custom settings
 * @throws {ConfigurationError} If the settings are invalid
 */
function build(custom) {
  var settings = extend(true, {}, defaults, custom || {});

  var validation = Joi.validate(settings, schema, {convert: false});

  if (validation.error) {
    throw new errors.ConfigurationError(validation.error.annotate());
  }

  return settings;
}

module.exports = {
  build: build
};
