import { get } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { pm2Status } from '@TSKShared/process/command'
import { TDSConfig } from '@TSKShared/devspace/devspace.types'
import { devspaceRunning } from '@TSKShared/devspace/devspaceRunning'
import { TTask, TTaskArgs, TTaskParams } from '@TSKShared/shared.types'


const STOPPED = Logger.colors.red(`Stopped`)
const RUNNING = Logger.colors.green(`Running`)

/**
 * Status PM2 daemons
 *
 * @returns {Object} - Status metadata of PM2
 */
const getPm2Status = async () => {
  const pm2List = await pm2Status()
  let status = {}
  pm2List.map(
    (item) =>
      (status = { 'PM2 Daemon      ': { status: RUNNING, info: `PID: ${item.pid}` } })
  )

  return status
}

/**
 * Status of devspace process
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Object} - Status metadata of devspace
 */
const getDevspaceStatus = async (params:TTaskParams, config:TDSConfig) => {
  const devspacePod = await devspaceRunning({ ...params, exec: true }, config)
  return !devspacePod
    ? { 'Devspace        ': { status: STOPPED } }
    : {
        'Devspace        ': {
          status: RUNNING,
          info: `POD: ${get(devspacePod, 'metadata.name')}`,
        },
      }
}

/**
 * Status devspace environment
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const statusAction = async ({ params, config }:TTaskArgs) => {
  const status = {
    ...(await getDevspaceStatus(params, config)),
    ...(await getPm2Status()),
  }

  Logger.empty()
  Logger.subHeader(`Strategy App Status`)
  Logger.blue(`Name             Status             Info`)
  Object.entries(status).map(([name, meta]) => {
    meta.info
      ? Logger.log(name, `${meta.status}            ${meta.info}`)
      : Logger.log(name, `${meta.status}`)
  })
  Logger.empty()
}

export const status:TTask = {
  name: 'status',
  action: statusAction,
  example: 'yarn task devspace status <options>',
  description: 'Gets the current status of host environment',
  options: {},
}
