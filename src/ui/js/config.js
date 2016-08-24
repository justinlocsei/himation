import { ConfigurationError } from 'himation/core/errors';

// This global variable is replaced at build time by Webpack with a partial
// configuration object containing non-sensitive data
const CONFIG = __WEBPACK_DEF_HIMATION_CONFIG;

/**
 * Get the value of a named configuration setting
 *
 * @param {string} name The name of a setting
 * @returns {*} The setting's value
 * @throws {ConfigurationError} If the path to the configuration file is undefined
 */
export function getSetting(name) {
  if (CONFIG === undefined) {
    throw new ConfigurationError('No configuration object exists');
  }

  const value = CONFIG[name];
  if (value === undefined) {
    throw new ConfigurationError(`No setting named ${name} was found`);
  }

  return value;
}
