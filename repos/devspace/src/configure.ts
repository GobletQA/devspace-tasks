import os from 'os'
import { deepMerge } from '@keg-hub/jsutils'
import { TEnvs } from '@TSKShared/shared.types'
import { buildRepos } from '@TSKShared/repos/buildRepos'
import { getRepoPaths } from '@TSKShared/repos/getRepoPaths'
import { getReposPath } from '@TSKShared/repos/getReposPath'
import { aliasContexts } from '@TSKShared/contexts/aliasContexts'
import { TDevSpaceConfig, TDSConfig } from '@TSKShared/devspace/devspace.types'

export const configureDevSpace = (input:TDevSpaceConfig) => {
  const { rootDir } = input
  const homeDir = os.homedir()

  const config:Record<string, any> = {}
  config.envs = deepMerge(input.envs) as TEnvs

  const reposDir = getReposPath(rootDir, input.reposDir, homeDir)
  const paths = getRepoPaths(reposDir)
  const repos = buildRepos(input.repos, paths, rootDir)

  config.aliasContext = aliasContexts(config.repos)

  config.paths = {
    rootDir,
    homeDir,
    reposDir,
    repos: paths,
    // TODO: add a way to resolve the devspace.yml file || or don't allow it to be overriden
    devspaceDir: rootDir
  }

  return config as TDSConfig
}