import { TInRepos, TEnvs, TOptions, TaskConfig, TSelectors } from '../shared.types'

export type TDeployArr = string[]
export type TActiveDeploys = Record<string, string>
export type TDeployOpts = [TSelectors, string[], TActiveDeploys]

export type TDevSpaceConfig = {
  envs?: TEnvs
  repos: TInRepos
  rootDir: string
  options: TOptions
  reposDir?: string
}

export class TDSConfig extends TaskConfig {
  
}

