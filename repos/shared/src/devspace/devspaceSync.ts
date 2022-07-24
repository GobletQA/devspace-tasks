import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { getLabelSelector } from './getLabelSelector'
import { TaskConfig, TTaskParams } from '../shared.types'
/**
 * Runs the sync script to sync local and container files
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceSync = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  const { selector, args } = getLabelSelector(params, config)

  const { local, container } = params
  const cmdArgs = [`sync`, `--local-path=${local}`, `--container-path=${container}`]

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params, config)
}
