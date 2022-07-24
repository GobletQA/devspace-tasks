import path from 'path'
import { RepoArgs } from './repos.types'
import { getRepoLoc } from './getRepoLoc'

/**
 * Finds the package.json file for a given repo based on passed in args
 * @returns {Object} - Loaded package.json as a JSON object
 */
export const getRepoPackage = (args:RepoArgs) => {
  const repoLoc = getRepoLoc(args)
  if(!repoLoc) throw new Error(`Could not find package.json for repo, as repo location is undefined`)

  return require(path.join(repoLoc, 'package.json'))
}