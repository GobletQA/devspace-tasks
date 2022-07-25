import { noOpObj } from '@keg-hub/jsutils'
import { loadEnvs } from '../envs/loadEnvs'
import { resolveContext } from '../contexts/resolveContext'
import { TaskConfig, TTaskParams, TEnvs } from '../shared.types'

/**
 * Gets tag of an image set in the value file for the env
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 * @param {Object} envs - Key/Value pairs of envs loaded from the values files
 *
 * @return {Object} - Resolved tagging option values
 */
export const getEnvImgTag = async (
  params:TTaskParams = noOpObj,
  docFileCtx:string = ``,
  envs:TEnvs,
  config:TaskConfig
) => {
  envs = envs || loadEnvs(params.env, config)

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
