'use strict';

var Joi = require('joi');

var errors = require('himation/core/errors');

/**
 * Himation server settings
 *
 * @typedef {object} HimationServerSettings
 * @property {string} address The address on which to bind the server
 * @property {string} path The path for the server's root URL
 * @property {number} port The port for the server
 * @property {string} protocol The protocol for the server
 * @property {string} publicURL The public absolute URL by which the server is accessed
 */
var serverSchema = Joi.object().keys({
  address: Joi.string().default('127.0.0.1'),
  path: Joi.string().default('/'),
  port: Joi.number().default(80),
  protocol: Joi.string().default('http'),
  publicURL: Joi.string()
}).default();

/**
 * Himation environment settings
 *
 * @typedef {object} HimationSettings
 * @property {object} assets Asset configuration information
 * @property {boolean} assets.debug Whether to bundle assets in debug mode
 * @property {string} assets.distDir The absolute path to the directory containing optimized assets
 * @property {boolean} assets.optimize Whether to optimize all bundled assets
 * @property {object} chiton Information on the Chiton API
 * @property {string} chiton.endpoint The absolute URL for the base Chiton endpoint
 * @property {string} chiton.token The token to use for authenticating Chiton requests
 * @property {boolean} debug Whether to run in debugging mode
 * @property {object} server Settings for the server
 * @property {boolean} server.debugLogging Whether to use a debugging-friendly log format
 * @property {object} servers Addresses for all known servers
 * @property {HimationServerSettings} servers.app Address components for the application server
 * @property {HimationServerSettings} servers.assets Address components for the assets server
 */
var schema = Joi.object().keys({
  assets: Joi.object().keys({
    debug: Joi.boolean().default(false),
    distDir: Joi.string(),
    optimize: Joi.boolean().default(false)
  }).default(),
  chiton: Joi.object().keys({
    endpoint: Joi.string(),
    token: Joi.string()
  }).default(),
  server: Joi.object().keys({
    debugLogging: Joi.boolean().default(false)
  }).default(),
  servers: Joi.object().keys({
    app: serverSchema,
    assets: serverSchema
  }).default()
}).default();

/**
 * Create custom settings by merging the given settings with the defaults
 *
 * @param {object} settings Custom settings to merge with the default settings
 * @returns {HimationSettings} The custom settings
 * @throws {ConfigurationError} If the settings are invalid
 */
function build(settings) {
  var validation = Joi.validate(settings, schema, {convert: false});
  if (validation.error) {
    throw new errors.ConfigurationError(validation.error.annotate());
  }

  return validation.value;
}

module.exports = {
  build: build
};
