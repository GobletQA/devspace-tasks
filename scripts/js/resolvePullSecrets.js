/**
 * Used by devspace in the devspace.yml to dynamically pull secrets for the application deployment
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 */

const { resolveValues } = require('./resolveValues')
const { getDockerUser, getDockerPassword, getDockerProviderUrl } = require('./dockerLogin')

;(async () => {

  const values = resolveValues()

  /** Try to load the docker auth user, if not found then we can't authenticate, so return  */
  const dockerAuthUser = await getDockerUser(values)
  if(!dockerAuthUser) return process.stdout.write(`[]`)

  /** Try to load the docker auth password, if not found then we can't authenticate, so return  */
  const dockerAuthPassword = getDockerPassword(values)
  if(!dockerAuthPassword) return process.stdout.write(`[]`)

  const dockerRegistry = getDockerProviderUrl(values)

  /**
   * Load the pull secret creds formatted to match yaml syntax
   */
  process.stdout.write([
    `- registry: ${dockerRegistry}`,
    `  username: ${dockerAuthUser}`,
    `  password: ${dockerAuthPassword}`,
  ].join('\n'))

})()
