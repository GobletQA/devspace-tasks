import { getRepo } from '../repos/getRepo'
import { RepoArgs } from '../repos/repos.types'
import { getRepoPackage } from '../repos/getRepoPackage'

/**
 * Builds the labels to add to the docker image
 *
 * @returns {Array<string>} - Build labels for the docker image
 */
export const getDockerLabels = (args:RepoArgs) => {
  const {
    config,
    fallback
  } = args

  const repo = args.repo || config && getRepo(args)
  const packConf = getRepoPackage({ ...args, repo })
  const labels = [`--label`, packConf.name]

  const label = repo?.label || repo?.deployment || fallback
  label && labels.push(`--label`, label)

  return labels
}
