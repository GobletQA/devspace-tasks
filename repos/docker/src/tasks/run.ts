
import { noOpArr } from '@keg-hub/jsutils'
import { loadEnvs } from '@TSKShared/envs/loadEnvs'
import { error, docker, Logger } from '@keg-hub/cli-utils'
import { getNpmToken } from '@TSKShared/envs/getNpmToken'
import { addRunEnvs } from '@TSKShared/docker/addRunEnvs'
import { addRunPorts } from '@TSKShared/docker/addRunPorts'
import { getTagOptions } from '@TSKShared/docker/getTagOptions'
import { resolveImgName } from '@TSKShared/docker/resolveImgName'
import { resolveContext } from '@TSKShared/contexts/resolveContext'
import { TaskConfig, TTask, TTaskArgs, TTaskParams, TEnvs } from '@TSKShared/shared.types'

/**
 * TODO: @lance-tipton We could try to parse the cmd form the options array
 * It will take a bit more time to investigate how to do that properly
 * So for now just use the `cmd` option
 */
const getRunCmd = (params:TTaskParams) => {
  const { cmd } = params
  return (cmd && (cmd as string).split(' ')) || noOpArr
}

/**
 * Finds the correct image to run based on passed in params
 * @param {Object} params - Parsed options passed to the run task
 * @param {string} docFileCtx - Current context of the docker image to run
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 *
 * @returns {string} - Image to use when running the container
 */
const getImgToRun = async (
  params:TTaskParams,
  docFileCtx:string,
  envs:TEnvs,
  config:TaskConfig
) => {
  const pImg = params?.image as string
  const pTag = params?.tag as string
  
  let tag = pImg.includes(':')
    ? pImg.split(':').pop()
    : (await getTagOptions(params, docFileCtx, envs, config))?.[pTag] || pTag

  const image = resolveImgName(params, docFileCtx, envs, config)

  return image
    ? `${image}:${tag}`
    : error.throwError(`Count not resolve image to run`, params, docFileCtx, envs)
}

/**
 * Gets the arguments to pass to the docker cli run command
 * @param {Object} params - Parsed options passed to the run task
 *
 * @returns {Array} - Generated docker cli run command arguments
 */
const getDockerRunArgs = ({ remove, attach, name, pull }:TTaskParams) => {
  const args = []
  remove && args.push(`--rm`)
  attach && args.push(`-it`)
  name && args.push(`--name`, name)
  const pullOpts = [`missing`, `never`, `always`]

  pullOpts.includes(pull as string)
    ? args.push(`--pull=${pull}`)
    : args.push(`--pull=never`)

  return args
}

/**
 * Runs a local docker image as a container
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
const runImg = async ({ params, config }:TTaskArgs) => {
  const { context, env, log } = params

  const envs = loadEnvs(env, config)
  const token = getNpmToken(config)
  const allEnvs = { ...envs, NPM_TOKEN: token }

  // Get the context for the docker image being run
  // TODO: create a root and repos config selectors
  const docFileCtx = resolveContext(
    context,
    config?.selectors?.repos,
    config?.selectors?.root
  ) as string

  const imgToRun = await getImgToRun(params, docFileCtx, envs, config)

  const cmdArgs = [
    `run`,
    ...getDockerRunArgs(params),
    ...addRunEnvs(allEnvs, docFileCtx),
    ...addRunPorts(params, docFileCtx, config),
    imgToRun,
    ...getRunCmd(params),
  ].filter((arg) => arg)

  log && Logger.pair(`Running Cmd:`, `docker ${cmdArgs.join(' ')}\n`)

  const output = await docker(cmdArgs, { cwd: config.paths.repoRoot, env: allEnvs })
  log && Logger.log(output)

  return output
}

export const run:TTask = {
  name: 'run',
  action: runImg,
  alias: ['rn', 'rnu'],
  options: {
    context: {
      example: `--context backend`,
      alias: ['ctx', `name`, `type`],
      description: `Context or name to use when resolving the Dockerfile to built`,
    },
    cmd: {
      alias: ['command', 'cdm', 'cd'],
      example: '--cmd "ls -ls /app"',
      description: `Override the default command of the docker image`,
    },
    ports: {
      default: [],
      type: 'array',
      alias: ['pt', 'port'],
      description: 'Bind a local port to the docker containers port',
    },
    attach: {
      default: true,
      type: 'boolean',
      alias: ['it', 'att'],
      description:
        'Attach to the stdio of the running container, same as -it option of the docker cli',
    },
    remove: {
      default: true,
      alias: ['rm'],
      type: 'boolean',
      description:
        'Automatically remove the container once it is stopped, same as --rm option of the docker cli',
    },
    pull: {
      alias: ['pl'],
      example: `--pull`,
      default: `never`,
      description: 'Image pull policy passed to the docker cli',
    },
    name: {
      alias: ['nm'],
      example: `--name my-container`,
      description: 'Name of the container being run',
    },
    image: {
      alias: ['img', 'igm', 'im'],
      example: `--image backend`,
      description:
        'Name of the image to be run, can also include the tag separated by a :',
    },
    tag: {
      alias: ['tg', 'tga'],
      default: `package`,
      example: `--tag package`,
      description:
        'Name of the tag of the image to be run if separate from the defined image',
    },
    log: {
      type: 'boolean',
      description: 'Log command before they are build',
    },
  },
}
