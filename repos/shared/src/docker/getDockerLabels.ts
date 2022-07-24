import path from 'path'
import { TaskConfig, TRepo } from '../shared.types'

type TArgs = {
  repo?: TRepo
  context?: string
  fallback?: string
  config?: TaskConfig
}

const getRepo = (args:TArgs):TRepo => {
  const {
    repo,
    config,
    context,
    fallback
  } = args

  return repo ||
    config?.repos[context] ||
    config?.repos[fallback]
}

/**
 * Builds the labels to add to the docker image
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} envs - ENV values loaded from the values.yml files
 *
 * @returns {Array<string>} - Build labels for the docker image
 */
export const getDockerLabels = (args:TArgs) => {
  const {
    config,
    fallback
  } = args

  const repo = getRepo(args)
  const repoLoc = repo?.path || config?.paths[repo.name] || config?.paths?.repoRoot
  const packConf = require(path.join(repoLoc, 'package.json'))
  const labels = [`--label`, packConf.name]

  const label = repo?.label || fallback
  label && labels.push(`--label`, label)

  return labels
}
