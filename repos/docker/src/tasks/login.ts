import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { loadEnvs } from '@TSKShared/envs/loadEnvs'
import { getNpmToken } from '@TSKShared/envs/getNpmToken'
import { TTask, TTaskArgs, TTaskParams } from '@TSKShared/shared.types'

/**
 * Login into the docker container registry relative to the docker image name
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
const docLogin = async ({ params, config }:TTaskArgs) => {
  const { dockerLogin } = require(path.join(config.paths.scriptsDir, 'js/dockerLogin'))

  const { log, registry, env } = params

  const envs = loadEnvs(env, config)
  const token = params.token || getNpmToken(config)
  const registryUrl = registry || envs.DOCKER_REGISTRY || envs.IMAGE.split('/').shift()

  const output = await dockerLogin(token, registryUrl)
  log && Logger.log(output)

  return output
}

export const login:TTask = {
  name: 'login',
  action: docLogin,
  alias: [`lgn`, `auth`],
  options: {
    registry: {
      alias: ['reg'],
      example: '--registry ghcr.io',
      description: 'Docker Registry url to log into, defaults to DOCKER_REGISTRY env',
    },
    token: {
      alias: ['tok'],
      example: '--token ****',
      description: `Custom login token for the active git user, defaults to resolved NPM token`,
    },
    log: {
      type: 'boolean',
      description: 'Log command before they are build',
    },
  },
}
