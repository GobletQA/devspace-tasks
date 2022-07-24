import { TRepo, TaskConfig } from '../shared.types'

export type TGetRepoArgs = {
  context?: string
  fallback?: string
  config?: TaskConfig
}

export type RepoArgs = {
  repo?: TRepo
  context?: string
  fallback?: string
  config?: TaskConfig
}
