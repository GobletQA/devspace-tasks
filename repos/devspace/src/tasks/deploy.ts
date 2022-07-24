import { getNpmToken } from '@TSKShared/envs'
import { TTask, TTaskArgs } from '@TSKShared/shared.types'
import { devspaceDeploy } from '@TSKShared/devspace/devspaceDeploy'

/**
 * Start devspace environment
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
const deployAction = async ({ params, config }:TTaskArgs) => {
  getNpmToken(config, params.gitToken as boolean)
  return await devspaceDeploy(params, config)
}

export const deploy:TTask = {
  name: 'deploy',
  action: deployAction,
  example: 'yarn task deploy <options>',
  description: 'Calls the yarn devspace deploy command',
  options: {
    config: {
      description: 'Optional filepath for yaml file',
    },
    log: {
      type: 'boolean',
      description: 'Log the devspace command to be run',
    },
    gitToken: {
      type: 'boolean',
      example: `--gitToken`,
      description: `Use the GIT_TOKEN ENV when setting NPM_TOKEN`,
    },
  },
}
