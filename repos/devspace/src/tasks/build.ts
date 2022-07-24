import { getNpmToken } from '@TSKShared/envs'
import { devspaceBuild } from '@TSKShared/devspace/devspaceBuild'
import { TTask, TTaskArgs } from '@TSKShared/shared.types'

/**
 * Builds all defined images and pushes them
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
const buildAction = async ({ params, config }:TTaskArgs) => {
  getNpmToken(config, params.gitToken as boolean)

  // Set BUILD_LOCAL_IMAGE to true to allow the images to be built from container/devspace.yml
  process.env.BUILD_LOCAL_IMAGE = `true`
  return await devspaceBuild({
    ...params,
    // Set skip to the inverse of push to allow setting the devspace skip-push arguments
    skip: !params.push,
  }, config)
}


export const build:TTask = {
  name: 'build',
  action: buildAction,
  example: 'yarn task build <options>',
  description: 'Calls the yarn devspace build command',
  options: {
    config: {
      description: 'Optional filepath for yaml file',
    },
    force: {
      // Add the b alias because it matches the devspace build argument
      // And prints a message that is should be used when force building
      alias: ['b'],
      description: 'Forces to build every image',
      type: 'boolean',
    },
    push: {
      default: false,
      type: 'boolean',
      description: 'Should the image be pushed after building',
    },
    tag: {
      description: 'Tag to add to all built images',
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
