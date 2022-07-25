import { exists } from '@keg-hub/jsutils'
import { KUBE_COMPONENT_LABEL } from '../constants'
import { TaskConfig, TConfigSelectors, TSelectors, TRepo } from '../shared.types'

type TSelectorCB = (selector:TSelectors, repo:TRepo) => TSelectors

/**
 * Generates a custom selector for kubernetes pods
 * assumes they includes the pre-defined KUBE_COMPONENT_LABEL
 * May need to re-work this to make it customizable
 */
const podsSelector = (
  selector:TSelectors,
  repo:TRepo
) => {
  repo.deployment
    && (selector[`${KUBE_COMPONENT_LABEL}=${repo.deployment}`] = {alias: [...repo.alias]})
  return selector
}

/**
 * Generates a selector for a apps ports used in port forwarding
 * Ports must be defined on the repos ports property
 */
const portsSelector = (
  selector:TSelectors,
  repo:TRepo
) => {
  repo.ports.length
    && (selector[repo.name] = {alias: [...repo.alias], value: repo.ports})
  return selector
}

/**
 * General helper, that generates a selector based on the passed in key
 * Expects the key to exist as a repos property, and maps it to the repos alias
 */
const generalSelector = (key:string):TSelectorCB => {
  return (
    selector:TSelectors,
    repo:TRepo
  ) => {
    exists(repo[key])
      && (selector[repo[key]] = {alias: [...repo.alias]})
    return selector
  }
}


/**
 * Helper to call a callback for each repo in the config
 * Callback is used to generate a selector for each repo based on a key
 */
const addSelector = (
  config:TaskConfig,
  callback:TSelectorCB
) => {
  return Object.entries(config?.repos)
    .reduce((selector, [key, repo]:[string, TRepo]) => {
      return callback(selector, repo)
    }, {} as TSelectors)
}

/**
 * Builds the custom selectors for each type in the config
 * Allows selecting specific apps and their properties via an alias
 */
export const selectorContexts = (
  config:TaskConfig
):TConfigSelectors => {
  const selectors:Partial<TConfigSelectors> = {}

  selectors.root = config?.repos?.root?.name
  selectors.pods = addSelector(config, podsSelector)
  selectors.ports = addSelector(config, portsSelector)
  selectors.repos = addSelector(config, generalSelector(`name`))
  selectors.images = addSelector(config, generalSelector(`image`))
  selectors.imageTags = addSelector(config, generalSelector(`imageTag`))
  selectors.deployments = addSelector(config, generalSelector(`deployment`))

  return selectors as TConfigSelectors
}