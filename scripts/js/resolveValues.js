const path = require('path')
const { loadConfigs } = require('@keg-hub/parse-config')
const { noOpObj, deepMerge } = require('@keg-hub/jsutils')

const appRoot = path.join(__dirname, `../../`)

const package = require(path.join(appRoot, './package.json'))
const { getNpmToken } = require(path.join(appRoot, './tasks/utils/envs/getNpmToken.js'))


/**
 * Gets a value form the values.yml files from passed in arguments
 * @param {Object} config - Config for the loadConfigs method
 *
 * @return {Object} - Loaded Value ENVs
 */
const resolveValues = (config=noOpObj) => {
  return loadConfigs(deepMerge({
    // TODO: figure out how to get the root app name, make this dynamic
    name: process.env[`DS_REPOS_ROOT_NAME`] || config?.repos?.root?.name,
    data: {package},
    locations: [appRoot],
    env: process.env.NODE_ENV || 'local',
  }, config))
}

/**
 * Gets the NPM Token from the ENV or from the getNpmToken helper
 *
 * @return {string} - Found npm token
 */
const resolveNPMToken = () => {
  return process.env[`NPM_TOKEN`] || getNpmToken()
}

module.exports = {
  resolveNPMToken,
  resolveValues
}
