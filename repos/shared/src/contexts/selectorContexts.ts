import { TaskConfig, TConfigSelectors } from '../shared.types'

// export type TSelectors = Record<string, string[]>
// export type TConfigSelectors = {
//   // Root application selector - Used as default 
//   root: string
  
//   // [repo.image]: [...repo.aliases]
//   images: TSelectors

//   // [repo.name]: [...repo.aliases]
//   repos: TSelectors

//   // [repo.port]: [...repo.aliases]
//   // [repos.frontend.port]: [...frontendAliases]
//   ports: TSelectors
  
//   // [`app.kubernetes.io/component=${repo.deployment}`]: [...repo.aliases]
//   pods: TSelectors

//   // [repo.image]: [...repo.aliases]
//   imageTags: TSelectors

//   // [repo.deployment]: [...repo.aliases]
//   deployments: TSelectors
// }

export const selectorContexts = (
  config:Partial<TaskConfig> & Pick<TaskConfig, 'repos' | 'paths' | 'aliasContext'>
):TConfigSelectors => {
  
  
  
  return {}
}