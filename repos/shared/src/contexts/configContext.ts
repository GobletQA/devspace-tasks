import os from 'os'
import { deepMerge } from '@keg-hub/jsutils'
import { TEnvs } from '../shared.types'
import { buildRepos } from '../repos/buildRepos'
import { getRepoPaths } from '../repos/getRepoPaths'
import { getReposPath } from '../repos/getReposPath'
import { aliasContexts } from '../contexts/aliasContexts'
import { selectorContexts } from '../contexts/selectorContexts'
import { TInDSConfig, TDSConfig } from '../devspace/devspace.types'

export const configureDevSpace = (input:TInDSConfig) => {
  const { rootDir } = input
  const homeDir = os.homedir()

  const config:Partial<TDSConfig> = {}
  config.envs = deepMerge(input.envs) as TEnvs

  const reposDir = getReposPath(rootDir, input.reposDir, homeDir)
  const paths = getRepoPaths(reposDir)

  config.repos = buildRepos(input.repos, paths, rootDir)
  config.aliasContext = aliasContexts(config.repos)

  config.paths = {
    rootDir,
    reposDir,
    repos: paths,
    homeDir: input.homeDir || homeDir,
    // TODO: add helper to search for these paths automatically
    // Should allow absolute || relative to root || relative to home
    valuesDir: input.valuesDir,
    configsDir: input.configsDir,
    devspaceDir: input.devspaceDir,
    dockerFilesDir: input.dockerFilesDir,
  }

  config.selectors = selectorContexts(config as TDSConfig)

  return config as TDSConfig
}