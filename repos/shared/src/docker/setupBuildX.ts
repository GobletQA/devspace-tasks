import { TEnvs } from '../shared.types'
import { docker, error } from '@keg-hub/cli-utils'

/**
 * Sets the docker buildx builder instance
 * @param {string} builder - Name of the docker buildx builder instance to use
 * @param {string} repoRoot - All envs loaded from the `container/values.yml` file
 * @param {Object} envs - All envs loaded from the `container/values.yml` file
 *
 * @returns {Void}
 */
export const setupBuildX = async (builder:string, repoRoot:string, envs:TEnvs) => {
  // Create the buildx builder context if it does not exist
  await docker([`buildx`, `create`, `--name`, builder], {
    cwd: repoRoot,
    env: envs,
    exec: true,
  })

  // Then try to use it, if we don't get an exitCode 0 response, then throw an error
  const { exitCode } = await docker([`buildx`, `use`, builder], {
    exec: true,
    cwd: repoRoot,
    env: envs,
  })

  exitCode &&
    error.throwError(
      `Could not switch to buildx context "builder". Please update the context manually`
    )
}
