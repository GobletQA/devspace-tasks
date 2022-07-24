import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Runs the devspace cleanup images command, to remove unused images
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceCleanImgs = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  return await devspace([`cleanup`, `images`], params, config)
}
