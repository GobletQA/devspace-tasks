import { getRepo } from './getRepo'
import { RepoArgs } from './repos.types'

export const getRepoLoc = (args:RepoArgs) => {
  const {
    config,
    context,
    fallback
  } = args

  const repo = args.repo || config && getRepo(args)
  if(!repo) throw new Error(`Could not find repo location, because repo undefined`)

  return repo?.path
    ? repo.path
    : repo.alias.reduce((repoPath, alias) => {
        return repoPath || config?.paths[alias]
      }, undefined as string) || config?.paths?.repoRoot
}