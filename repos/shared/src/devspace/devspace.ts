import { command } from '../process/command'
import { getConfigPath } from './getConfigPath'
import { ensureArr, noOpObj } from '@keg-hub/jsutils'
import { getDevspaceContext } from './getDevspaceContext'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Finds the index of the last argument with a --, and appends the default devspace arguments
 * @function
 * @public
 * @param {string|Array<string>} cmd - Devspace command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Array<string>} - Updated cmd arguments with the defaults added
 */
const addDefaultArgs = async (cmd:string, params:TTaskParams, config:TaskConfig) => {
  const contextArgs = await getDevspaceContext(params, config)

  /**
   * Ensure the cmd is an array, and find the last argument with a `-`
   * Then use that index as the location to add the default arguments
   */
  let insertIdx
  const cmdArr = ensureArr(cmd).map((item, idx) => {
    insertIdx = item.startsWith(`-`) ? idx : insertIdx
    return item
  })

  insertIdx = insertIdx || cmdArr.length

  const defArgs = [
    `--config`,
    // TODO: have this properly resolve the devspace config path
    getConfigPath(params.config),
    `--profile`,
    params.profile || params.env,
  ]

  /** Add the default arguments at the found insertIdx */
  cmdArr.splice(insertIdx, 0, ...contextArgs, ...defArgs)

  return cmdArr
}

/**
 * Runs a devspace command and returns the output
 * Exits the process if the devspace command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - Devspace command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const devspaceCmd = command('devspace')

export const devspace = async (cmd, params = noOpObj, config:TaskConfig) => {
  const cmdArgs = await addDefaultArgs(cmd, params, config)

  return await devspaceCmd(cmdArgs, params)
}

