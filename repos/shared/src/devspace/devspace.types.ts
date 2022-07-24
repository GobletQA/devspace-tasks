import { TInRepos, TEnvs, TOptions, TaskConfig, TSelectors } from '../shared.types'

export type TDeployArr = string[]
export type TActiveDeploys = Record<string, string>
export type TDeployOpts = [TSelectors, string[], TActiveDeploys]

export type TInDSConfig = {
  envs?: TEnvs
  repos: TInRepos
  rootDir: string
  options: TOptions
  reposDir?: string
  homeDir?: string
  valuesDir?: string
  configsDir?: string
  devspaceDir?: string
  dockerFilesDir?: string
}

export class TDSConfig extends TaskConfig {
}

