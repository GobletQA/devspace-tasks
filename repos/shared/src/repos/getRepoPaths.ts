import path from 'path'
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { camelCase } from '@keg-hub/jsutils'
import { TReposPaths } from '../shared.types'

/**
 * Finds all sub-repo paths from the reposPath directory that contain a package.json file
 * @type {function}
 *
 * @return {Object} - Found repo paths by camel-case name
 */
export const getRepoPaths = (reposPath:string):TReposPaths => {
  // list of the repo names located at `<root>/repos`
  return execSync('ls', { cwd: reposPath })
    .toString()
    .split('\n')
    .filter(Boolean)
    .reduce((values, name:string) => {
      const repo = path.join(reposPath, name)
      existsSync(path.join(repo, `./package.json`)) && (values[camelCase(name)] = repo)

      return values
    }, {})
}

