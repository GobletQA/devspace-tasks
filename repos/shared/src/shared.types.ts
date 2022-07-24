import { TAliasContext } from './contexts/contexts.types'

export type TTaskParams = {
  [key:string]: any
}

export type TSelectors = Record<string, string[]>

export type TConfigSelectors = {
  // Root application selector - Used as default 
  root: string
  
  // [repo.image]: [...repo.aliases]
  images: TSelectors

  // [repo.name]: [...repo.aliases]
  repos: TSelectors

  // [repo.port]: [...repo.aliases]
  ports: TSelectors
  
  // [`app.kubernetes.io/component=${repo.deployment}`]: [...repo.aliases]
  pods: TSelectors

  // [repo.image]: [...repo.aliases]
  imageTags: TSelectors

  // [repo.deployment]: [...repo.aliases]
  deployments: TSelectors
}

export class TaskConfig {
  envs?: TEnvs
  repos?: TRepos
  paths?:TRepoPaths
  options: TOptions
  selectors: TConfigSelectors
  aliasContext: TAliasContext
}

export type TInRepo = {
  envs?: TEnvs
  name?: string
  label?: string
  path?: string
  short?: string
  alias?: string[]
  deployment?: string
  [key: string]: any
}

export type TInRepos = {
  [key: string]: TInRepo
}

export type TRepo = {
  envs?: TEnvs
  name: string
  path: string
  label: string
  short?: string
  alias: string[]
  deployment: string
}

export type TRepos = {
  [key: string]: TRepo
}

export type TOptions = {
  authKeys: string[]
  gitToken?: boolean
  [key:string]: any
}

export type TEnv = 'local' | 'develop' | 'squad' | 'staging' | 'qa' | 'production' | 'demo' | 'biz' | 'main'

export type TEnvs = {
  [key:string]: string|number|boolean|undefined|null
}

// The key name should match the name of the corresponding repo when repo path is not set
export type TRepoPaths = {
  [key:string]: string
}
