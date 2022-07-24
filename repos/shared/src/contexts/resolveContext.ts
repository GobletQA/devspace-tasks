import { exists } from '@keg-hub/jsutils'
import { TSelectors } from '../shared.types'

/**
 * Resolves the context used to reference a kubernetes resource
 * Also checks if the context is an alias of the app or db, and returns the corresponding selector
 * @param {string} context - Passed in context option from params object
 * @param {Object} selectors - Key Value pair of selectors for each resource
 * @param {*} fallback - Fallback value to use is no context match is found
 *
 * @return {string} - Selector for referencing a kubernetes resource
 */
export const resolveContext = (context = ``, selectors:TSelectors, fallback?:string|boolean) => {
  const lowerContext = context.toLowerCase()

  const match = Object.entries(selectors)
    .reduce((found, [name, alias]) => {
      return found || !alias.includes(lowerContext)
        ? found
        : name
    }, false)

  return match
    ? match
    : exists(fallback)
      ? fallback
      : context
}
