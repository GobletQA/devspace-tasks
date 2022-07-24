const { noOpObj } = require('@keg-hub/jsutils')
const { error } = require('@keg-hub/cli-utils')
const { loadEnvs } = require('../envs/loadEnvs')
const { resolveContext } = require('./resolveContext')
const { getKubePods } = require('../kubectl/getKubePods')

/**
 * Finds a single pod based on the pods metadata labels
 * Returns the first found pod, where a label value matches the passed in context
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - Found pod object or undefined
 */
const getKubePod = async (params = noOpObj, config=noOpObj) => {
  const { context, env } = params
  !context && error.throwError(`The context param is required to find a pod`)

  // TODO: use config?.aliasContext?.selectors to create selectors for kubernetes/component
  // Example:
  // [repo.deployment]: [...repo.aliases]
  const match = resolveContext(context, config?.selectors?.deployments)

  !match &&
    error.throwError(`Can not match a pod to non-existing match argument ${match}`)

  const { items } = await getKubePods(params)

  return items.find((item) =>
    Object.values(item.metadata.labels)
      .map((val) => val.toLowerCase().trim())
      .includes(match.toLowerCase().trim())
  )
}

module.exports = {
  getKubePod,
}
