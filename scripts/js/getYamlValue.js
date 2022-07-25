/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 */
const { resolveValues, resolveNPMToken } = require('./resolveValues')

/**
 * Gets a value form the values.yml files from passed in arguments
 * @param {string} key - Name of the value to get from the values files
 */
const getFromValues = (key) => {
  if(key === `NPM_TOKEN`) return resolveNPMToken()

  const loadedValues = resolveValues()
  
  switch(key){
    case `WB_DB_USER`:
      return loadedValues.WB_DB_USER || loadedValues.NEO4J_AUTH.split('/').shift()
    case `WB_DB_PASSWORD`:
      return loadedValues.WB_DB_PASSWORD || loadedValues.NEO4J_AUTH.split('/').pop()
    case `NEO4J_DATABASE`:
      return loadedValues.NEO4J_DATABASE || loadedValues.WB_DB_NAME
    default:
      return loadedValues[key]
  }
}

/** 
 * Get the args passed to the script
 * First should be the key name of the value to get
 * Second should be a fallback if the key is not found
 * @example
 * node scripts/js/getYamlValue.js MY_KEY_NAME fallback-value
 *
*/
const args = process.argv.slice(2)
const key = args.shift()
const fallback = args.shift() || ''

/** 
 * Write the output to the terminal so devspace can pick up the response
 * Check for an existing env first, then get the value from values.yml, then fallback, finally empty string
 * An empty string is added to ensure 'undefined' || false is not written due to the or ( || ) operator
*/
process.stdout.write(`${process.env[key] || getFromValues(key) || fallback || ''}`)
