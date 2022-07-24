/**
 * Gets the docker build cmd args to pass on to the build cmd call
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Array<string>} - Build cmd args to use when calling docker build
 */
const getDockerBuildParams = ({ cache, force, push }) => {
  return [
    force && `--force-rm`,
    !cache && `--no-cache`,
    push ? `--push` : `--load`,
  ].filter((arg) => arg)
}

module.exports = {
  getDockerBuildParams,
}
