const { getNpmToken } = require('../../utils/envs')
const { devspaceDeploy } = require('../../utils/devspace/devspaceDeploy')

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
const deploy = async ({ params }) => {
  getNpmToken()
  return await devspaceDeploy(params)
}

module.exports = {
  deploy: {
    name: 'deploy',
    action: deploy,
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
    },
  },
}
