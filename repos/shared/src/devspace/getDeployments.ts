import { error } from '@keg-hub/cli-utils'
import { TDSConfig, TDeployArr } from './devspace.types'
import { TEnv, TSelectors } from '../shared.types'
import { getDeploymentOpts } from './getDeploymentOpts'
import { exists, isStr, noOpArr } from '@keg-hub/jsutils'
import { resolveContext } from '../contexts/resolveContext'
import { setDeploymentEnvs } from '../envs/setDeploymentEnvs'

type TFilterdDeploys = {
  skipArr: TDeployArr
  contextArr: TDeployArr
}

/**
 * Gets all allowed apps to deploy relative to the skip array
 * @param {Array<string>|string} skip - List of apps that should not run for the command
 * @param {Object} envs - All envs parsed from the value files for the current environment
 *
 * @return {Array} - All allow apps that can be deployed
 */
const getAllowedDeployments = (
  skipArr:TDeployArr,
  deploySelector:TSelectors,
  deployArr:TDeployArr
) => {
  const shouldSkip = skipArr.reduce((acc, app) => {
    const deployment = resolveContext(app, deploySelector)

    deployment && acc.push(deployment)

    return acc
  }, [])

  // Filter out any apps that are not allowed to deploy
  const allowedDeploys = deployArr.filter(
    (deployment) => !shouldSkip.includes(deployment)
  )

  // Ensure there are allow apps, otherwise throw
  return allowedDeploys.length
    ? allowedDeploys
    : error.throwError(`At least 1 deployment must be allowed to run this task`)
}

const getDeployArrs = (
  context?:string,
  skip?:string|string[]
):TFilterdDeploys => {
  // Ensure skip and context are both arrays
  const skipArr = Array.isArray(skip)
    ? skip
    : isStr(skip)
      ? skip.split(`,`)
      : noOpArr

  const contextArr = Array.isArray(context)
    ? context
    : isStr(context)
      ? context.split(`,`)
      : noOpArr

  return { contextArr, skipArr }
}

/**
 * Loop over the context deployments, and compare with the allowed
 * If it's in the allowed array, the add it to the accumulator
 */
const findDeployments = (
  contextArr:TDeployArr,
  allowedDeploys:TDeployArr,
  deploySelector:TSelectors
) => {
  const deployments = contextArr.reduce((acc, app) => {
    const deployment = resolveContext(app, deploySelector)
    // Ensure it's in the allow array, and add it to the accumulator
    allowedDeploys.includes(deployment as string) && acc.push(deployment)

    return acc
  }, [])

  // Ensure there are apps to deploy, otherwise throw
  !deployments.length &&
    error.throwError(`At least 1 deployment must be allowed to run this task`)
  
  return deployments
}

/**
 * Gets all passed in apps that match an app context
 * @param {Array<string>|string} context - List of apps that should run for the command
 * @param {Array<string>|string} skip - List of apps that should not run for the command
 * @param {string} env - The current environment the command is running in
 *
 * @return {string} - Context converted into a string of app deployments
 */
export const getDeployments = (
  config:TDSConfig,
  context?:string,
  skip?:string|string[],
  env?:TEnv
) => {
  const [deploySelector, deployArr, activeMap] = getDeploymentOpts(config, env)

  // If no context and no skip, return undefined to deploy all
  if (!exists(context) && !exists(skip)) {
    setDeploymentEnvs(deployArr, activeMap)
    return undefined
  }

  const { contextArr, skipArr } = getDeployArrs(context, skip)

  // If no context and no skip, return undefined to deploy all
  if (!contextArr.length && !skipArr.length) {
    setDeploymentEnvs(deployArr, activeMap)
    return undefined
  }

  // Get the array of apps that are allowed to be deployed
  const allowedDeploys = skipArr.length
    ? getAllowedDeployments(skipArr, deploySelector, deployArr)
    : deployArr

  // If no context is defined, return all allowed deploys
  if (!contextArr.length) {
    setDeploymentEnvs(allowedDeploys, activeMap)

    return allowedDeploys.join(',')
  }

  const deployments = findDeployments(contextArr, allowedDeploys, deploySelector)

  setDeploymentEnvs(deployments, activeMap)

  return deployments.join(',')
}


