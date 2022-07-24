import { exists } from '@keg-hub/jsutils'

/**
 * Sets envs for all apps the should be included in the command
 * @param {Array} - Deployment names of all apps included in the command being run
 *
 * @return {void}
 */
export const setDeploymentEnvs = (deployments, activeMap:Record<string, string>) => {
  deployments.forEach((deployment:string) => {
    const env = activeMap[deployment]
    !exists(process.env[env]) && (process.env[env] = deployment)
  })
}

