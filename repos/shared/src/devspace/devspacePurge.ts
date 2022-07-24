import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { getDeployments } from './getDeployments'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Runs the devspace purge command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspacePurge = async (params:TTaskParams = noOpObj, config:TaskConfig) => {
  const { context, skip, ...cmdParams } = params

  const cmdArgs = []
  params.dependencies && cmdArgs.push(`--all`)

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(config, context, skip, params.env)
  deployments && cmdArgs.push(`--deployments`, deployments)

  return await devspace([`purge`, ...cmdArgs], cmdParams, config)
}
