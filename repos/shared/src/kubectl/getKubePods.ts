import { kubectl } from './kubectl'
import { TTaskParams, JSONObject } from '../shared.types'
import { noOpObj, parseJSON } from '@keg-hub/jsutils'

type TKubeRes = {
  items: JSONObject[]
}

/**
 * Runs kubectl get pods command, and converts the respond into a JSON object
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - JSON object of the currently running pods
 */
export const getKubePods = async (params:TTaskParams = noOpObj):Promise<TKubeRes> => {
  const data = await kubectl([`get`, `pods`, `-o`, `json`], { ...params, exec: true })

  // @ts-ignore
  return parseJSON(data, false)
}

