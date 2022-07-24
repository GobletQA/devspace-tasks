import path from 'path'
import { existsSync } from 'fs'
import { getRepo } from '../repos/getRepo'
import { RepoArgs } from '../repos/repos.types'
import { getRepoLoc } from '../repos/getRepoLoc'


/**
 * Loops over all possible locations for a repo and the root level locations
 * Uses the location, checks if the file exists at that location
 * If found that location is returned 
 */
export const locFromContexts = (args:RepoArgs, file:string) => {
  const { config } = args

  const repo = args.repo || getRepo(args)
  const repoLoc = getRepoLoc({ ...args, repo })
  const isDocker = file.includes(`Dockerfile`)
  const isValues = file.includes(`values`)
  const isDevspace = file.includes(`devspace`)

  return [
    // Check the repo paths
    isDocker && path.dirname(repo?.dockerFile || ``),
    isValues && path.dirname(repo?.valuesFile || ``),
    isDevspace && repo?.devspaceDir,
    repo?.configsDir,
    repoLoc,
    // Check the general / root level paths
    isDocker && config?.paths?.dockerFilesDir,
    isValues && config?.paths?.valuesDir,
    isDevspace && config?.paths?.devspaceDir,
    config?.paths?.configsDir,
    config?.paths?.rootDir,
  ].find(loc => {
    const fullLoc = loc && path.join(loc, file)
    return fullLoc && existsSync(fullLoc)
  })

}