import { error } from '@keg-hub/cli-utils'
import { getNpmToken } from '@TSKShared/envs'
import { devspace } from '@TSKShared/devspace/devspace'
import { setDeploymentEnvs } from '@TSKShared/envs/setDeploymentEnvs'
import { getDeploymentOpts } from '@TSKShared/devspace/getDeploymentOpts'

/**
 * General devspace command the forards the first argument on to the devspace executable
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
const command = async ({ task, params, config }) => {
  const cmd = process.argv.slice(3).shift()

  !task.alias.includes(cmd) &&
    error.throwError(
      `Command ${cmd} is not a valid devspace command. Must be one of ${task.alias.join(
        ' | '
      )}`
    )

  const [_, deployments, activeMap] = getDeploymentOpts(params.env)
  setDeploymentEnvs(deployments, activeMap)

  getNpmToken(config)
  return await devspace([cmd, `--debug`], params, config)
}

export const cmd = {
  name: 'cmd',
  alias: ['analyze', 'render', 'print', 'ui'],
  action: command,
  example: 'yarn dev <cmd> <options>',
  description: 'Calls the devspace command',
  options: {},
}
