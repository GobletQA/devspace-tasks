import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { getLabelSelector } from './getLabelSelector'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceEnter = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  const cmdArgs = [`enter`]
  const { selector, args } = getLabelSelector(params, config)

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params, config)
}
