import { error } from '@keg-hub/cli-utils'
import { noOpObj } from '@keg-hub/jsutils'
import { loadEnvs } from '../envs/loadEnvs'
import { TTaskParams, TaskConfig } from '../shared.types'

/**
 * Runs devspace use command passing in the configured namespace and kube-context
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<Array<string>>} - Array containing namespace and kube-context arguments
 */
export const getDevspaceContext = (params:TTaskParams = noOpObj, config:TaskConfig) => {
  const { namespace, kubeContext, env } = params
  const { DS_KUBE_NAMESPACE = `devspace`, DS_KUBE_CONTEXT } = loadEnvs(env)
  const ns = namespace || config?.options?.namespace || DS_KUBE_NAMESPACE
  const ctx = kubeContext || config?.options?.context || DS_KUBE_CONTEXT

  !ctx &&
    error.throwError(`A "kubernetes context" is required to run devspace commands`)

  return [`--namespace`, ns, `--kube-context`, ctx]
}

