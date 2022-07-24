const { noOpObj, exists } = require('@keg-hub/jsutils')
const {
  beContextAlias,
  feContextAlias,
  dbContextAlias,
  proxyContextAlias,
} = require('../../constants')

/**
 * Resolves the context used to reference a kubernetes resource
 * Also checks if the context is an alias of the app or db, and returns the corresponding selector
 * @param {string} context - Passed in context option from params object
 * @param {Object} selectors - Key Value pair of selectors for each resource
 * @param {*} fallback - Fallback value to use is no context match is found
 *
 * @return {string} - Selector for referencing a kubernetes resource
 */
const resolveContext = (context = ``, selectors = noOpObj, fallback) => {
  const lowercaseContext = context.toLowerCase()

  return selectors.db && dbContextAlias.includes(lowercaseContext)
    ? selectors.db
    : selectors.be && beContextAlias.includes(lowercaseContext)
      ? selectors.be
      : selectors.fe && feContextAlias.includes(lowercaseContext)
        ? selectors.fe
        : selectors.px && proxyContextAlias.includes(lowercaseContext)
          ? selectors.px
          : exists(fallback)
            ? fallback
            : context
}

module.exports = {
  resolveContext,
}
