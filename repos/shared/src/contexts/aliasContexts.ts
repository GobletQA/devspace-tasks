import { TRepos } from '../shared.types'
import { TAliasContext } from './contexts.types'


/**
 * Generates the aliasContexts for an application
 * Helps with finding which project should be built
 */
export const aliasContexts = (repos:TRepos) => {
  const contexts:TAliasContext = {
    all: [],
    short: {},
    selectors: {}
  }

  Object.entries(repos)
    .map(([name, repo]) => {
      const { alias, short } = repo
      contexts.short[name] = short || name
      if(!alias) return

      alias && (contexts.all = contexts.all.concat(alias))
      contexts.selectors[name] = alias
    })

  return contexts 
}