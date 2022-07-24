import { TTaskParams, TParam } from '../shared.types'

/**
 * Gets the docker build cmd args to pass on to the build cmd call
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Array<string>} - Build cmd args to use when calling docker build
 */
export const getDockerBuildParams = ({ cache, force, push }:TTaskParams) => {
  return [
    (force as TParam) && `--force-rm`,
    (!cache as TParam) && `--no-cache`,
    (push as TParam) ? `--push` : `--load`,
  ].filter((arg) => arg)
}
