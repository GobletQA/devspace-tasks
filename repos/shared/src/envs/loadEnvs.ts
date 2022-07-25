import { exists, isStr } from '@keg-hub/jsutils'
import { addToProcess } from '@keg-hub/cli-utils'
import { loadConfigs } from '@keg-hub/parse-config'
import { TaskConfig } from '..//shared.types'
/**
 * Internal env cache to speed up task execution
 * @type {Object}
 */
const __CACHED_ENVS = {}

/**
 * Loads the envs from the `values` files based on passed in`env`
 * Caches response based on env and search locations
 * @param {string} env - Current env to use when searching for values files
 * @param {Array<string>} locations - Extra locations to search for values files
 * @param {string} name - Name of app included in the name of searched for values files
 * @param {boolean} cache - Should the env cache be used
 *
 * @return {Object} - Loaded envs based on passed in arguments
 */
export const loadEnvs = (
  env:string=process.env.NODE_ENV,
  config:TaskConfig,
  name?:string,
  cache?:boolean
) => {
  cache = exists(cache) ? cache : true
  const locations = Object.values(config.paths).filter(isStr)

  // Check if the envs were already loaded and use the cach if it exsts
  const cacheKey = `${env}-${locations.sort().join('-')}`
  if (cache && __CACHED_ENVS[cacheKey]) return __CACHED_ENVS[cacheKey]

  const mergedEnvs = loadConfigs({
    env,
    locations,
    name: name || config.repos.root.name,
  })

  // Add the loaded envs to the current process.env
  addToProcess(mergedEnvs)

  // Cache the envs to speed up future calls
  __CACHED_ENVS[cacheKey] = mergedEnvs

  return mergedEnvs
}
