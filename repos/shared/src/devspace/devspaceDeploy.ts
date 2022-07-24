import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceDeploy = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  return await devspace([`deploy`], params, config)
}
