import { devspaceUse } from './devspaceUse'
import { get, noOpObj } from '@keg-hub/jsutils'
import { getKubePod } from '../kubectl/getKubePod'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Checks if devspace is already running, by checking in the pod already exists and is in a Running phase
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {boolean} - True if the pod is running
 */
export const devspaceRunning = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  await devspaceUse(params, config)
  const pod = await getKubePod({ ...params, context: 'app' }, config)

  return get(pod, `status.phase`) === `Running` ? pod : false
}
