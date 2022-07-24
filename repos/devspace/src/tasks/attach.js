const { allContextAlias } = require('../../constants')
const { devspaceEnter } = require('../../utils/devspace/devspaceEnter')

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
const attach = async ({ params }) => {
  return await devspaceEnter(params)
}

module.exports = {
  attach: {
    name: 'attach',
    action: attach,
    alias: ['enter', 'att'],
    example: 'yarn task devspace attach <options>',
    description: 'Calls the yarn devspace enter command to attach to the running pod',
    options: {
      context: {
        default: `backend`,
        alias: ['name', 'selector'],
        allowed: allContextAlias,
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
  },
}
