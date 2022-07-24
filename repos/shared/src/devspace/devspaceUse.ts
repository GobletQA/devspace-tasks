import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { getDevspaceContext } from './getDevspaceContext'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Runs devspace use command passing in the configured namespace and kube-context
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceUse = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  const [__, namespace] = getDevspaceContext(params, config)
  return await devspace([`use`, `namespace`, namespace], params, config)
}
