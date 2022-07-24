import { devspace } from './devspace'
import { noOpObj } from '@keg-hub/jsutils'
import { loadEnvs } from '../envs/loadEnvs'
import { TaskConfig, TTaskParams } from '../shared.types'
import { resolveContext } from '../contexts/resolveContext'

/**
 * Runs the devspace logs command, passing in the context as the --image-selector
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceLogs = async (params:TTaskParams=noOpObj, config:TaskConfig) => {
  const { context, env, follow } = params

  const cmdArgs = [`logs`]
  follow && cmdArgs.push(`--follow`)

  const envs = loadEnvs(env)
  // TODO: use config??.selectors?.pods to create pods for kubernetes/component
  // [`app.kubernetes.io/component=${repo.deployment}`]: [...repo.alias],
  const selector = resolveContext(context, config?.selectors?.pods)

  selector && cmdArgs.push(`--label-selector`, selector as string)

  return await devspace(cmdArgs, params, config)
}
