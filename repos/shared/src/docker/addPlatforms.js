const { noPropArr } = require('@keg-hub/jsutils')

/**
 * Generates a string of platforms the image should be built for
 * @param {Array} platforms - List of platforms to build the image form
 * @param {boolean} push - Should the built image be pushed to a provider registry after building
 *
 * @returns {Array<string>} - Platforms converted into the docker build argument format
 */
const addPlatforms = (platforms = noPropArr, push) => {
  return platforms.length && push ? [`--platform`, platforms.join(`,`)] : noPropArr
}

module.exports = {
  addPlatforms,
}
