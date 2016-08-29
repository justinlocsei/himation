'use strict';

var Joi = require('joi');

var errors = require('himation/core/errors');

/**
 * Himation server settings
 *
 * @typedef {object} HimationServerSettings
 * @property {string} address The address on which to bind the server
 * @property {string} caCertificatePath The path to the certificate for the CA that signed the server's certificate
 * @property {string} path The path for the server's root URL
 * @property {number} port The port for the server
 * @property {string} protocol The protocol for the server
 * @property {string} publicUrl The public absolute URL by which the server is accessed
 */
var serverSchema = Joi.object().keys({
  address: Joi.string().default('127.0.0.1'),
  caCertificatePath: Joi.string(),
  path: Joi.string().default('/'),
  port: Joi.number().default(80),
  protocol: Joi.string().default('http'),
  publicUrl: Joi.string()
}).default();

/**
 * Himation environment settings
 *
 * @typedef {object} HimationSettings
 * @property {object} assets Asset configuration information
 * @property {boolean} assets.debug Whether to bundle assets in debug mode
 * @property {string} assets.distDir The absolute path to the directory containing optimized assets
 * @property {boolean} assets.optimize Whether to optimize all bundled assets
 * @property {object} caching Configuration for the gateway cache
 * @property {string} caching.gatewayUrl The URL for the gateway caching server
 * @property {number} caching.ttl The number of seconds for which to cache cacheable backend responses
 * @property {object} chiton Information on the Chiton API
 * @property {string} chiton.endpoint The absolute URL for the base Chiton endpoint
 * @property {string} chiton.token The token to use for authenticating Chiton requests
 * @property {boolean} debug Whether to run in debugging mode
 * @property {string} environment The name of the application environment
 * @property {object} errors Information on handling errors
 * @property {string} errors.sentryDsn The Sentry DSN to use
 * @property {string} errors.sentryDsnPublic The public Sentry DSN to use
 * @property {boolean} errors.track Whether or not to track errors
 * @property {string} facebookAppId The Facebook app ID to use
 * @property {string} googleAnalyticsId The Google Analytics ID to use
 * @property {object} server Settings for the server
 * @property {boolean} server.debugLogging Whether to use a debugging-friendly log format
 * @property {object} servers Addresses for all known servers
 * @property {HimationServerSettings} servers.app Address components for the application server
 * @property {HimationServerSettings} servers.assets Address components for the assets server
 * @property {boolean} trackStats Whether to track application stats
 */
var schema = Joi.object().keys({
  assets: Joi.object().keys({
    debug: Joi.boolean().default(false),
    distDir: Joi.string(),
    optimize: Joi.boolean().default(false)
  }).default(),
  caching: Joi.object().keys({
    gatewayUrl: Joi.string(),
    ttl: Joi.number().default(60)
  }).default(),
  chiton: Joi.object().keys({
    endpoint: Joi.string(),
    token: Joi.string()
  }).default(),
  debug: Joi.boolean().default(false),
  environment: Joi.string().default('development'),
  errors: Joi.object().keys({
    sentryDsn: Joi.string(),
    sentryDsnPublic: Joi.string(),
    track: Joi.boolean().default(false)
  }).default(),
  facebookAppId: Joi.string().default(null),
  googleAnalyticsId: Joi.string(),
  server: Joi.object().keys({
    debugLogging: Joi.boolean().default(false)
  }).default(),
  servers: Joi.object().keys({
    app: serverSchema,
    assets: serverSchema
  }).default(),
  trackStats: Joi.boolean().default(false)
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
