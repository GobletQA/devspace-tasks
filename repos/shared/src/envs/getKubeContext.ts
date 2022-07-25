import { loadEnvs } from './loadEnvs'
import { error } from '@keg-hub/cli-utils'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Gets the kubernetes context to use for kubernetes commands
 * If not set in the ENV, the throws an error
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {string} - Value to use for the kubernetes context
 */
export const getKubeContext = (params:TTaskParams, config:TaskConfig) => {
  const { kubeContext, env } = params

  if (kubeContext) return kubeContext
  else if (process.env.DS_KUBE_CONTEXT) return process.env.DS_KUBE_CONTEXT

  const { DS_KUBE_CONTEXT } = loadEnvs(env, config)

  return (
    DS_KUBE_CONTEXT
      || error.throwError(`The "KUBE_CONTEXT" is required to run devspace commands`)
  )
}
