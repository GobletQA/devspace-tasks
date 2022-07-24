import { error } from '@keg-hub/cli-utils'
import { noOpObj } from '@keg-hub/jsutils'
import { getKubePods } from '../kubectl/getKubePods'
import { resolveContext } from '../contexts/resolveContext'
import { TaskConfig, TTaskParams, JSONObject } from '../shared.types'


/**
 * Finds a single pod based on the pods metadata labels
 * Returns the first found pod, where a label value matches the passed in context
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - Found pod object or undefined
 */
export const getKubePod = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  const { context } = params
  !context && error.throwError(`The context param is required to find a pod`)

  // TODO: use config?.aliasContext?.selectors to create selectors for kubernetes/component
  // Example:
  // [repo.deployment]: [...repo.aliases]
  const match = resolveContext(context, config?.selectors?.deployments) || ``

  !match &&
    error.throwError(`Can not match a pod to non-existing match argument ${match}`)

  const { items } = await getKubePods(params)

  // TODO: validate that match is a string and items is string[] 
  return items.find((item) =>
    Object.values((item?.metadata as JSONObject)?.labels)
      .map((val) => (val as string).toLowerCase().trim())
      .includes((match as string).toLowerCase().trim())
  )
}

