import { TRepo } from '../shared.types'
import { buildContextArr } from '../contexts/buildContextArr'
import { TGetRepoArgs } from './repos.types'

/**
 * Gets a repo from the config based on the passed in context
 */
export const getRepo = ({
  config,
  context,
  fallback
}:TGetRepoArgs) => {
  const contextArr = buildContextArr(context, fallback)
  return contextArr.reduce((repo, alias) => {
    return repo || config?.repos[alias]
  }, undefined as TRepo)
}