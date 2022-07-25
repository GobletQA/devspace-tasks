import os from 'os'
import { deepMerge } from '@keg-hub/jsutils'
import { buildRepos } from '../repos/buildRepos'
import { ROOT_DIR_FILE_MAP } from '../constants'
import { getRepoPaths } from '../repos/getRepoPaths'
import { getReposPath } from '../repos/getReposPath'
import { searchForLoc } from '../config/searchForLoc'
import { aliasContexts } from '../contexts/aliasContexts'
import { selectorContexts } from '../contexts/selectorContexts'
import { TInTaskConfig, TaskConfig, TEnvs } from '../shared.types'

const searchForLocs = (input:TInTaskConfig) => {
  const {
    rootDir,
    valuesDir,
    configsDir,
    devspaceDir,
    dockerFilesDir,
  } = input
  
  const searchDirs:Record<string, string> = {}
  const args = { rootDir: input.rootDir, fallback: rootDir, asDir: true }

  searchDirs.configsDir = searchForLoc({
    ...args,
    loc: configsDir,
    type: `configsDir`,
    file: ROOT_DIR_FILE_MAP.configsDir,
  })
  args.fallback = searchDirs.configsDir

  searchDirs.valuesDir = searchForLoc({
    ...args,
    loc: valuesDir,
    type: `valuesDir`,
    file: ROOT_DIR_FILE_MAP.valuesDir,
  })

  searchDirs.devspaceDir = searchForLoc({
    ...args,
    loc: devspaceDir,
    type: `devspaceDir`,
    file: ROOT_DIR_FILE_MAP.devspaceDir,
  })

  searchDirs.dockerFilesDir = searchForLoc({
    ...args,
    loc: dockerFilesDir,
    type: `dockerFilesDir`,
    file: ROOT_DIR_FILE_MAP.dockerFilesDir,
  })

  return searchDirs
}

export const configContext = (input:TInTaskConfig) => {
  const { rootDir } = input
  const homeDir = os.homedir()

  const config = {} as unknown as TaskConfig
  config.envs = deepMerge(input.envs) as TEnvs

  const reposDir = getReposPath(rootDir, input.reposDir, homeDir)
  const paths = getRepoPaths(reposDir)

  config.paths = {
    rootDir,
    reposDir,
    repos: paths,
    homeDir: input.homeDir || homeDir,
    ...searchForLocs(input)
  }

  config.repos = buildRepos({
    paths,
    rootDir,
    repos: input.repos,
  })

  config.aliasContext = aliasContexts(config.repos)

  // TODO: add internal paths
  config.__internal = {
    
  }

  config.selectors = selectorContexts(config)


  return config as TaskConfig
}