'use strict';

var sortBy = require('lodash/sortBy');

/**
 * A size for a single image
 *
 * @typedef {object} HimationImageSize
 * @property {number} height The height of the image
 * @property {string} path The path to the image
 * @property {string} size The size descriptor for the image
 * @property {number} width The width of the image
 */

/**
 * Dimensions for an image
 *
 * @typedef {object} HimationImageDimensions
 * @property {number} height The height of the image
 * @property {number} width The width of the image
 */

/**
 * Convert a series of image sizes to a srcset value
 *
 * @param {HimationImageSize[]} imageSizes Size/path combinations for images
 * @returns {string} A valid srcset attribute
 */
function imageSizesToSrcset(imageSizes) {
  return imageSizes
    .map(imageSize => imageSize.path + ' ' + imageSize.size)
    .join(', ');
}

/**
 * Convert a series of image sizes to dimensions for a given display width
 *
 * @param {HimationImageSize[]} imageSizes Size/path combinations for images
 * @param {number} width The display width for the image
 * @returns {HimationImageDimensions} The display dimensions for the image
 */
function imageSizesToDimensions(imageSizes, width) {
  var normalSize = sortBy(imageSizes, size => size.width)[0];
  var aspectRatio = normalSize.width / normalSize.height;

  return {
    height: width / aspectRatio,
    width: width
  };
}

module.exports = {
  imageSizesToDimensions: imageSizesToDimensions,
  imageSizesToSrcset: imageSizesToSrcset
};
