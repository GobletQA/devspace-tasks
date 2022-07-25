import { docker, Logger } from '@keg-hub/cli-utils'
import { loadEnvs } from '@TSKShared/envs/loadEnvs'
import { dockerLogin } from '@TSKScripts/js/dockerLogin'
import { getNpmToken } from '@TSKShared/envs/getNpmToken'
import { setupBuildX } from '@TSKShared/docker/setupBuildX'
import { addBuildArgs } from '@TSKShared/docker/addBuildArgs'
import { addPlatforms } from '@TSKShared/docker/addPlatforms'
import { getDockerFile } from '@TSKShared/docker/getDockerFile'
import { resolveImgTags } from '@TSKShared/docker/resolveImgTags'
import { resolveContext } from '@TSKShared/contexts/resolveContext'
import { getDockerLabels } from '@TSKShared/docker/getDockerLabels'
import { getDockerBuildParams } from '@TSKShared/docker/getDockerBuildParams'
import { TaskConfig, TTask, TTaskArgs, TEnvs } from '@TSKShared/shared.types'

/**
 * Looks for a custom IMAGE_FROM value based on the context or custom context env
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} allEnvs - All loaded envs for the app
 * @param {string} from - Value passed to the from option from the cmd line
 *
 * @returns {void}
 */
const resolveImgFrom = (
  docFileCtx:string,
  shortContext:string,
  allEnvs:TEnvs,
  from:string,
  imageName:string,
  config:TaskConfig
) => {
  // If from option is set, then set the IMAGE_FROM value
  // Which will override the default IMAGE_FROM in the Dockerfile
  // If it includes a : assume a image and tag, otherwise assume from is a tag
  if(from) return from.includes(':') ? from : `${imageName}:${from}`

  // Check if there is a custom env set based on the docFileContext
  // And use that to override the default IMAGE_FROM
  // This allows each dockerfile to use it's own base image if needed
  const repoImgFrom = docFileCtx && config.repos[docFileCtx].imageFrom
  return repoImgFrom
    || allEnvs[`DS_${(docFileCtx || ``).toUpperCase()}_IMAGE_FROM`]
    || allEnvs[`DS_${(shortContext || ``).toUpperCase()}_IMAGE_FROM`]
}

/**
 * Runs a docker build command and returns the output
 * @function
 * @public
 * @param {string|Array<string>} cmd - kubectl command to build split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const buildImg = async ({ params, config }:TTaskArgs) => {
  const {
    env,
    log,
    from,
    push,
    image,
    builder,
    context,
    gitToken,
    platforms
  } = params

  const envs = loadEnvs(env, config)
  const token = getNpmToken(config, gitToken as boolean)
  const allEnvs = { ...envs, NPM_TOKEN: token }

  // Ensure we are using the correct buildx builder instance
  builder && (await setupBuildX(builder as string, config.paths.repoRoot, allEnvs))

  // Get the context for the docker image being built
  const docFileCtx = resolveContext(context, config?.selectors?.repos) as string
  const shortContext = config?.aliasContext?.short[docFileCtx]

  // Get the name of the image that will be built
  const imageName = image
    || envs[`DS_${(docFileCtx || ``).toUpperCase()}_IMAGE`]
    || (envs[`DS_${(shortContext || ``).toUpperCase()}_IMAGE`])
    || envs.IMAGE

  // Ensure we are logged into docker
  // Uses the DOCKER_REGISTRY env or the final images name to get the registry url to log into
  const registryUrl = envs.DOCKER_REGISTRY || imageName.split('/').shift()
  await dockerLogin(token, registryUrl)

  // Set the custom base image based on the from option and context
  allEnvs.IMAGE_FROM =
    resolveImgFrom(docFileCtx, shortContext, allEnvs, from as string, imageName, config) ||
    allEnvs.IMAGE_FROM

  const builtTags = await resolveImgTags(params, docFileCtx, envs, config)

  const cmdArgs = [
    `buildx`,
    `build`,
    ...getDockerBuildParams(params),
    ...builtTags,
    ...getDockerLabels({ context, config }),
    ...getDockerFile(config, docFileCtx),
    ...addPlatforms(platforms as string[], push as boolean),
    ...addBuildArgs(allEnvs),
    `.`,
  ].filter((arg) => arg)

  log && Logger.pair(`Running Cmd:`, `docker ${cmdArgs.join(' ')}\n`)

  const output = await docker(cmdArgs, { cwd: config.paths.repoRoot, env: allEnvs })
  if (!log) return

  output
    ? Logger.error(`Image build failed\n`)
    : Logger.success(`Image build succeeded\n`)

  return output
}


export const build:TTask = {
  name: 'build',
  alias: ['bld'],
  action: buildImg,
  example: 'yarn task dev img build <options>',
  description: 'Calls the image build command',
  options: {
    context: {
      example: `--context proxy`,
      alias: ['ctx', `name`, `type`],
      description: `Context or name to use when resolving the Dockerfile to built`,
    },
    push: {
      type: 'boolean',
      default: false,
      description: 'Push the built image to the docker provider',
    },
    tag: {
      type: `array`,
      alias: ['tags'],
      default: [`package`],
      example: `--tag package,branch`,
      allowed: [`package`, `branch`, `commit`, `values`, `env`, `node`],
      description: 'Name of the tag to add to the built Docker image',
    },
    image: {
      env: `IMAGE`,
      description: 'Name of the docker image to be built. Used when tagging',
    },
    force: {
      default: true,
      type: 'boolean',
      description: 'Force remove temporary images used while building',
    },
    log: {
      type: 'boolean',
      description: 'Log command before they are build',
    },
    builder: {
      default: `devspace-builder`,
      description: 'Name of the docker buildx builder instance to use',
    },
    cache: {
      type: 'boolean',
      default: true,
      description: 'User docker cache when building the image',
    },
    platforms: {
      type: `array`,
      default: [`linux/amd64`, `linux/arm64`],
      description: 'List of docker platforms to be built',
    },
    tagMatch: {
      type: `string`,
      example: `--tagMatch main:branch`,
      description: `Use a specific tag type based on the git branch`,
    },
    base: {
      type: 'boolean',
      example: `--base`,
      description: `Should the base image be built first. Only used when "--context" option is set`,
    },
    from: {
      example: `--from 2.4.3`,
      description: `Base docker image version or tag to use when build non base image. Only used when "--context" option is set`,
    },
    gitToken: {
      type: `boolean`,
      example: `--gitToken`,
      description: `Use the GIT_TOKEN ENV when setting NPM_TOKEN`,
    },
  },
}
