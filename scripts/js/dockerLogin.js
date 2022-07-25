const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')
const { Logger, execCmd, error } = require('@keg-hub/cli-utils')
const { resolveValues, resolveNPMToken } = require('./resolveValues')

const appRoot = path.join(__dirname, `../../`)

/**
 * Gets the url of the docker image defined in values.yml file
 * @throws
 * @param {string} - The missing argument
 */
const throwMissing = (missing) => {
  throw new Error(`Could not resolve value for ${missing}`)
}

/**
 * Gets the url of the docker image defined in values.yml file
 *
 * @returns {string} - Found docker provider URL
 */
const getDockerProviderUrl = (envs=noOpObj) => {
  return (
    process.env.DS_DOCKER_PROVIDER
      || process.env.DS_IMAGE
      || envs.DS_DOCKER_PROVIDER
      || envs.DS_IMAGE
      || process.env.DOCKER_PROVIDER
      || process.env.IMAGE
      || envs.DOCKER_PROVIDER
      || envs.IMAGE
      || ''
    ).split('/').shift()
}

/**
 * Gets the docker users email from envs or falls back to the git config user
 * Uses this user to login to github docker registry
 * @param {Object} values - Loaded Value ENVs
 *
 * @return {string} - Found docker auth user
 */
const getDockerUser = async (envs=noOpObj) => {
  const user =  process.env.DS_DOCKER_AUTH_USER
    || envs.DS_DOCKER_AUTH_USER
    || process.env.DOCKER_AUTH_USER
    || envs.DOCKER_AUTH_USER

  if(user) return user

  const { error:err, data } = await execCmd(`git config user.email`, { cwd: appRoot }) 
  err && error.throwError(err)

  return data.trim()
} 


/**
 * Gets the value for the Docker password by checking for DOCKER_AUTH_PASSWORD, then NPM_TOKEN envs
 * Tries to load from the ENV, then Values, Then the git config user
 * Because we use github for our image registry we can use the same NPM token for docker login
 *
 * @param {Object} envs - Loaded Value ENVs
 *
 * @return {string} - Found docker auth password
 */
const getDockerPassword = (envs=noOpObj) => {
  return process.env.DS_DOCKER_AUTH_PASSWORD
    || envs.DS_DOCKER_AUTH_PASSWORD
    || envs.DS_DOCKER_TOKEN
    || envs.DS_GIT_TOKEN
    || envs.DS_NPM_TOKEN
    || process.env.DOCKER_AUTH_PASSWORD
    || envs.DOCKER_AUTH_PASSWORD
    || resolveNPMToken()
    || envs.NPM_TOKEN
}

/**
 * Gets the current users email from the git config
 * Uses that email and the found NPM Token to log into a github remote docker image registry
 * Will not work on other registries
 * @param {string} token - Docker registry token or password
 * @param {string} providerUrl - Url of the Docker registry to log into
 * @param {string} [user] - User name of the user to use when logging in
 * @param {boolean} log - Log output of docker login commands
 *
 * @returns {Array<string>} - Array of envs converted to build-args for the docker build command
 */
const dockerLogin = async (token, providerUrl, user, log=true) => {
  const envs = resolveValues()
  user = user || await getDockerUser(envs) || throwMissing(`docker auth "user"`)
  token = token || getDockerPassword(envs) || throwMissing(`docker auth "password/token"`)
  providerUrl = providerUrl || getDockerProviderUrl(envs)

  const cmd = [
    `docker`,
    `login`,
    providerUrl,
    `-u`,
    user.trim(),
    `-p`,
    token
  ].filter(arg => arg).join(' ')

  log && Logger.log(`\nLogging into docker provider ${providerUrl}...`)
  const { error: err, data } = await execCmd(cmd)
  return error && !data ? error.throwError(err) : log && Logger.success(`Docker ${data}`)
}


require.main === module && dockerLogin()

module.exports = {
  dockerLogin,
  getDockerUser,
  getDockerPassword,
  getDockerProviderUrl,
}
