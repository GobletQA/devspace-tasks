const path = require('path')
const { scriptsDir } = require('../../paths')
const { Logger } = require('@keg-hub/cli-utils')
const { loadEnvs } = require('../../utils/envs/loadEnvs')
const { getNpmToken } = require('../../utils/envs/getNpmToken')
const { dockerLogin } = require(path.join(scriptsDir, 'js/dockerLogin'))

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
const docLogin = async (args) => {
  const { params } = args
  const { log, registry, env } = params

  const envs = loadEnvs(env)
  const token = params.token || getNpmToken()
  const registryUrl = registry || envs.DOCKER_REGISTRY || envs.IMAGE.split('/').shift()

  const output = await dockerLogin(token, registryUrl)
  log && Logger.log(output)

  return output
}

module.exports = {
  login: {
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
  },
}
