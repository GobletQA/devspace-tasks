import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { TaskConfig, TTaskParams } from '../shared.types'
import { getCmdOptions } from './getCmdOptions'

/**
 * Flags for the devspace build command pulled from the task definition options
 * @type {Object}
 */
const flags = {
  force: '-b',
  skip: '--skip-push',
}

/**
 * Keys relative to Values for the devspace build command pulled from the task definition options
 * @type {Array}
 */
const values = ['tag']

/**
 * Runs the devspace build command - Builds all defined images
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceBuild = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  return await devspace([`build`, ...getCmdOptions(params, flags, values)], params, config)
}
