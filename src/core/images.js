'use strict';

/**
 * A size for a single image
 *
 * @typedef {object} HimationImageSize
 * @property {string} path The path to the image
 * @property {string} size The size descriptor for the image
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

module.exports = {
  imageSizesToSrcset: imageSizesToSrcset
};
