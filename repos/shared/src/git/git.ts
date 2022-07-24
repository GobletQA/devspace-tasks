import { command } from '../process/command'
import { deepMerge, noOpObj } from '@keg-hub/jsutils'
import { TTaskParams, TaskConfig } from '../shared.types'
import { TCmd, TCmdParams } from '../process/process.types'

/**
 * Runs a git command and returns the output
 * Exits the process if the git command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - Git command to run split as an array
 * @param {Object} opts - Options to pass to the child process
 *
 * @returns {Void}
 */
const gitCmd = command('git')
export const git = (
  cmd:TCmd,
  params:TTaskParams = noOpObj,
  config:TaskConfig
) => gitCmd(cmd, deepMerge({ exec: true, cwd: config?.paths?.rootDir }, params) as TCmdParams)

