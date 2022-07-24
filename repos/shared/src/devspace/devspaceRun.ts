import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Runs the devspace run command, passing in the command name as an argument
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceRun = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  const { cmd } = params
  return await devspace([`run`, cmd], params, config)
}
