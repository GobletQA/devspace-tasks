
export type TTaskOptionType = 'arr' | 'array' | 'obj' | 'object' | 'num' | 'number' | 'boolean' | 'bool' | 'string' | 'str'

export type TTaskOption = {
  env?: string
  alias?: string[],
  example?: string,
  description?: string,
  type?: TTaskOptionType,
  [key:string]: any
}

export type TTaskOptions = Record<string, TTaskOption>

export type TTaskArgs = {
  task: TTask
  command: string
  options: string[]
  params: TTaskParams
  tasks: Record<string, TTask>
  [key:string]: any
}

export type TTaskAction = (args:TTaskArgs) => Promise<any> | any

export type TTask = {
  name: string,
  tasks?: TTasks
  alias?: string[]
  example?: string
  config: TaskConfig
  action?: TTaskAction
  description?: string
  options?: TTaskOptions
  [key:string]: any
}

export type TTasks = {
  [key:string]: TTask
}

export type JSONObject = {
  [key: string]: JSONVal
}
type JSONArray = JSONVal[]
export type JSONVal = string | number | boolean | JSONObject | JSONArray


export type TParam = JSONVal
export type TTaskParams = {
  env?: TEnv
  log?: boolean
  context?: string
  [key:string]: TParam
}

export type TSelectorMeta = {
  alias: string[]
  value?: any
}

export type TSelectors = Record<string, TSelectorMeta>

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

export type TAliasContext = {
  all: string[]
  short?: Record<string, string>
  selectors?: TConfigSelectors
}


export type TInternalPaths = {
  scriptsDir: string
  configsDir: string
  [key:string]: string
}

export type TInternal = {
  envs?: TEnvs
  paths?: TInternalPaths
}

export type TInTaskConfig = {
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

export class TaskConfig {
  envs?: TEnvs
  repos?: TRepos
  options: TOptions
  paths?:TConfigPaths
  __internal: TInternal
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
  image?: string
  imageTag?: string
  deployment?: string
  dockerFile?: string
  [key: string]: any
}

export type TInRepos = {
  [key: string]: TInRepo
}

export type TRepo = {
  envs: TEnvs
  name: string
  path: string
  label: string
  short: string
  alias: string[]
  ports: string[]
  image: string
  deployment: string
  imageTag?: string
  imageFrom?: string
  valuesFile?: string
  dockerFile?: string
  configsDir?: string
  devspaceDir?: string
}

export type TRepos = {
  [key: string]: TRepo
}

export type TBuildReposArgs = {
  rootDir:string
  repos:TInRepos,
  paths:TReposPaths,
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
export type TReposPaths = {
  [key: string]: string
}

export type TConfigPaths = {
  repos: TReposPaths
  rootDir: string
  homeDir: string
  reposDir: string
  valuesDir?: string
  configsDir?: string
  devspaceDir?: string
  dockerFilesDir?: string
}

export type TDeployArr = string[]
export type TActiveDeploys = Record<string, string>
export type TDeployOpts = [TSelectors, string[], TActiveDeploys]

export type TSearchLocArgs = {
  loc:string,
  file?: string
  type?: string
  rootDir:string,
  asDir?: boolean
  fallback?:string,
}