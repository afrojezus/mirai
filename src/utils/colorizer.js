/**
 * Colorizer
 */
import * as Vibrant from "node-vibrant";

/**
 * Colorizer(image)
 * @returns {Promise}
 * @param {String} image - Image source (URL)
 */
export default image => {
  return Vibrant.from(image)
    .getPalette()
    .then(palette => {
      return palette;
    });
};
