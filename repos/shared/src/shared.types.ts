import { TAliasContext } from './contexts/contexts.types'

export type JSONObject = {
  [key: string]: JSONVal
}
type JSONArray = JSONVal[]
export type JSONVal = string | number | boolean | JSONObject | JSONArray


export type TParam = JSONVal
export type TTaskParams = {
  env?: TEnv
  context?: string
  [key:string]: TParam
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
  // [repos.frontend.port]: [...frontendAliases]
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
  paths?:TConfigPaths
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
  port?: string
  ports?: string[]
  deployment?: string
  image?: string
  imageTag?: string
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
  short: string
  image: string
  alias: string[]
  ports: string[]
  imageTag: string
  deployment: string
  dockerFile?: string
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
export type TConfigPaths = {
  rootDir: string
  dockerFiles?: string
  [key:string]: string
}
