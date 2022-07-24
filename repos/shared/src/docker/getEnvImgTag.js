const { loadEnvs } = require('../envs/loadEnvs')
const { noOpObj } = require('@keg-hub/jsutils')
const { resolveContext } = require('../kubectl/resolveContext')

/**
 * Gets tag of an image set in the value file for the env
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 * @param {Object} envs - Key/Value pairs of envs loaded from the values files
 *
 * @return {Object} - Resolved tagging option values
 */
const getEnvImgTag = async (params = noOpObj, docFileCtx = ``, envs, config) => {
  envs = envs || loadEnvs(params.env)

  return resolveContext(
    docFileCtx,
    // TODO: Create an image tag context selector,
    // Example:
    // {
    //   [repos.backend.imageTag]: [...backendAliases],
    //   [repos.frontend.imageTag]: [...frontendAliases],
    // },
    // repos.root.imageTag
    config?.selectors?.imageTags,
    config?.repos?.root?.imageTag
  )
}

module.exports = {
  getEnvImgTag,
}
