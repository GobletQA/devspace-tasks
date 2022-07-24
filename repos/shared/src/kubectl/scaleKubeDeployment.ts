
import { kubectl } from './kubectl'
import { error } from '@keg-hub/cli-utils'
import { loadEnvs } from '../envs/loadEnvs'
import { noOpObj, isNum } from '@keg-hub/jsutils'
import { resolveContext } from '../contexts/resolveContext'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Scales a deployments replicas up or down based on passed in params
 * Returns the first found pod, where a label value matches the passed in context
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {Object} - Found pod object or undefined
 */
export const scaleKubeDeployment = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  const { amount, context, env } = params

  !context &&
    error.throwError(`The deployment context param is required to scale a deployment`)
  !isNum(amount) && error.throwError(`The amount param is required to scale a deployment`)

  const envs = loadEnvs(env)

  // TODO: create a deployments selector
  const deployment = resolveContext(context, config?.selectors?.deployments) as string

  return await kubectl([`scale`, `deploy`, deployment, `--replicas=${amount}`], {
    ...params,
    exec: true,
  })
}
