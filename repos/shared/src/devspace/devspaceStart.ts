import { devspace }from './devspace'
import { noOpObj }from '@keg-hub/jsutils'
import { getCmdOptions }from './getCmdOptions'
import { devspaceRunning }from './devspaceRunning'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Flags for the devspace dev command relative to the task definition options
 */
const flags = {
  build: '-b',
  debug: `--debug`,
}

/**
 * Keys relative to Values for the devspace build command pulled from the task definition options
 * @type {Array}
 */
const values = ['deployments']

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 * @param {Object} daemonOpts - Options for starting devspace as a background daemon
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
export const devspaceStart = async (
  params:TTaskParams=noOpObj,
  daemonOpts = noOpObj,
  config:TaskConfig
) => {
  const cmdArgs = getCmdOptions(params, flags, values)

  /**
   * Check if devspace is already running
   * If it is, and build is not set, then skip the deploy process
   * And only setup the port-forwarding and file syncing
   */
  const isRunning = await devspaceRunning(params, config)
  isRunning && !params.build && cmdArgs.push(`--skip-pipeline`)

  // Add the daemon back the the params for the devspace dev command
  return await devspace([`dev`, ...cmdArgs], { ...params, ...daemonOpts }, config)
}

module.exports = {
  devspaceStart,
}
