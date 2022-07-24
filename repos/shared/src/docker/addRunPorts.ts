import { TaskConfig, TTaskParams } from '../shared.types'
import { resolveContext } from '../contexts/resolveContext'
import { ensureArr, isArr, toBool, isStr } from '@keg-hub/jsutils'

/**
 * Finds the ports to bind from the localhost to a docker container
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array} - Ports to be bound
 */
const resolveAllPorts = (
  params:TTaskParams,
  docFileCtx:string,
  config:TaskConfig
):string[] => {
  const paramPorts = ensureArr(params.ports || [])
  const allPorts = Object.values(config.repos).reduce((acc, repo) => {
    repo.ports.length && acc.push(...repo.ports)
    return acc
  }, [] as string[])

  // Get the context for the docker image being run
  const envPorts = ensureArr(
    resolveContext(
      docFileCtx,
      // TODO: Create a port context selector,
      config?.selectors?.ports,
      allPorts
    )
  )

  return paramPorts.concat(envPorts)
}

/**
 * Checks if binding a local port to the container should be skipped
 * @param {Array} ports - Array of ports that should be bound
 *
 * @returns {Boolean} - True if ports should be bound
 */
const skipPortBind = (ports:(string|number)[]) => {
  return Boolean(!isArr(ports) || ports.map(toBool).includes(false))
}

/**
 * Gets the local ports that should be bound to the running container
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array} - Formatted port arguments to pass to the docker run cli
 */
export const addRunPorts = (
  params:TTaskParams,
  docFileCtx:string=``,
  config:TaskConfig
):string[] => {
  
  const ports = params.ports as (string|number)[]
  if (skipPortBind(ports)) return []

  return resolveAllPorts(params, docFileCtx, config)
    .reduce((acc, port) => {
      port = isStr(port) ? port : `${port}`

      port &&
        (port.includes(`:`) || port.includes(`/`)
          ? acc.push(`-p`, port)
          : acc.push(`-p`, `${port}:${port}`))

      return acc
    }, [])
}