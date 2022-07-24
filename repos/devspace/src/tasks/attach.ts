import { TTask, TTaskArgs } from '@TSKShared/shared.types'
import { devspaceEnter } from '@TSKShared/devspace/devspaceEnter'

/**
 * Run the devspace enter command to attach to a running pod
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
const attachAction = async ({ params, config }:TTaskArgs) => {
  return await devspaceEnter(params, config)
}

export const attach:TTask = {
  name: 'attach',
  action: attachAction,
  alias: ['enter', 'att'],
  example: 'yarn task devspace attach <options>',
  description: 'Calls the yarn devspace enter command to attach to the running pod',
  options: {
    context: {
      alias: ['name', 'selector'],
      description: 'Context for the task being run relative to the devspace pods',
    },
    config: {
      description: 'Optional filepath for yaml file',
    },
    log: {
      type: 'boolean',
      description: 'Log the devspace command to be run',
    },
  },
}
