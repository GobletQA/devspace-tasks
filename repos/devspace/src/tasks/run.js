const { devspaceRun } = require('../../utils/devspace/devspaceRun')

/**
 * Log the output of a running kubernetes pod
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
const run = async ({ params, config }) => {
  /**
   * Devspace requires the command be run from the same dir as the devspace.yml file
   * Seems to be a bug, but it's the only way it works even with the --config path set
   */
  return await devspaceRun({ ...params, cwd: config?.paths?.devspaceDir })
}

module.exports = {
  run: {
    name: 'run',
    alias: ['run', 'cmd'],
    action: run,
    example: 'yarn task devspace run <options>',
    description: 'Calls the devspace run command',
    options: {
      cmd: {
        required: true,
        alias: ['context', 'command'],
        description: 'Name of the command to be run from the container/devspace.yml file',
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
