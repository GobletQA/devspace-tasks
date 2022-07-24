import { getNpmToken } from '@TSKShared/envs/getNpmToken'
import { TTask, TTaskArgs } from '@TSKShared/shared.types'
import { TDSConfig } from '@TSKShared/devspace/devspace.types'
import { devspaceStart } from '@TSKShared/devspace/devspaceStart'
import { resolveContext } from '@TSKShared/contexts/resolveContext'
import { getDeployments } from '@TSKShared/devspace/getDeployments'
import { setPullPolicyEnv } from '@TSKShared/envs/setPullPolicyEnv'

const setStartEnvs = (params, config:TDSConfig) => {
  const { install, pull, build } = params
  setPullPolicyEnv(pull)

  /**
   * Set the DS_BUILD_LOCAL_IMAGE env based on the passed in build option
   * This determines if the docker images should be built locally or pulled from a registry
   */
  process.env.DS_BUILD_LOCAL_IMAGE = build

  /**
   * Set the DS_NM_INSTALL env based on the passed in install option
   * Tells the corresponding app to run yarn install prior to starting
   */
  const nmInstall = resolveContext(
    install,
    config?.selectors?.repos,
    false
  )

  nmInstall && (process.env.DS_NM_INSTALL = `${nmInstall}`)
}

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
const startAction = async ({ params, config }:TTaskArgs) => {
  // Extract the daemon flag so it doesn't impact other commands
  // We only want it set on the devspace start command
  const {
    daemon,
    watch,
    install,
    context,
    skip,
    pull,
    gitToken,
    ...altParams
  } = params
  setStartEnvs(params, config)

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(config, context, skip as string[], params.env)

  getNpmToken(config, gitToken as boolean)
  return await devspaceStart({ ...altParams, deployments }, { daemon, watch }, config)
}


export const start: TTask = {
  name: 'start',
  action: startAction,
  example: 'yarn task devspace start <options>',
  description: 'Calls the devspace dev command',
  options: {
    context: {
      type: 'array',
      example: `--context app`,
      alias: ['ctx', `name`, `type`, 'deployment', 'deploy'],
      description: `Contexts or names of apps to be started`,
    },
    skip: {
      type: 'array',
      alias: ['bypass'],
      example: `--skip app`,
      description: `Contexts or names of apps NOT to be started`,
    },
    config: {
      description: 'Optional filepath for yaml file',
    },
    build: {
      default: false,
      type: 'boolean',
      description: 'Build docker image before running',
    },
    log: {
      default: false,
      type: 'boolean',
      description: 'Log the devspace command to be run',
    },
    daemon: {
      default: false,
      type: 'boolean',
      alias: ['d', `background`, `bg`, `detach`],
      description: 'Runs the devspace command in the background',
    },
    watch: {
      default: true,
      type: 'boolean',
      description: `Watch the logs after starting the application as a daemon. Only used when "--daemon" option is "true"`,
    },
    tag: {
      env: `IMAGE_TAG`,
      example: `--tag package`,
      allowed: [`package`, `branch`, `commit`, `values`],
      description: 'Name of the tag to use when pulling the docker image',
    },
    image: {
      env: `IMAGE`,
      description: 'Name of the docker image to use when starting the application',
    },
    debug: {
      default: false,
      type: 'boolean',
      description: 'Runs the devspace command in debug mode',
    },
    profile: {
      description: 'Devspace profile to use defined in the container/devspace.yml',
    },
    install: {
      type: 'string',
      example: `--install proxy`,
      alias: [`in`, 'yarn', 'nm'],
      description: `Name of the app that should run yarn install prior to starting.`,
    },
    pull: {
      example: `--pull never`,
      alias: [`pull_policy`, `pullpolicy`, `pp`],
      allowed: [`IfNotPresent`, `Always`, `Never`, 'present', 'exists'],
      description: `Set the image pull policy when starting the docker container, based on kubernetes pull policy`,
    },
    gitToken: {
      type: 'boolean',
      example: `--gitToken`,
      description: `Use the GIT_TOKEN ENV when setting NPM_TOKEN`,
    },
  },
}
