/**
 * Used by devspace in the devspace.yml to dynamically generate an ingress hosts
 * Should only generate config when a host and sub domain exist
 */
const { resolveValues } = require('./resolveValues')

/**
 * Gets the value to use when generating the ingress hosts from the process or values file
 * @param {Object} values - ENVs loaded from the values file
 * @param {string} key - ENV name to get the value of
 *
 * @returns {string|undefined} - found value or undefined
 */
const getEnvValue = (values, key) => {
  return process.env[key] || values[key]
}

;(async () => {
  const prefix = process.argv.slice(2).shift()
  if(!prefix) return

  const values = resolveValues()
  const subDomain = getEnvValue(values, `WB_SUB_DOMAIN`)
  const hostDomain = getEnvValue(values, `WB_HOST_DOMAIN`)
  const deployment = getEnvValue(values, `WB_${prefix}_DEPLOYMENT`)

  /**
   * Build the ingress host based on the host and sub domains
   */
  const ingressHost = hostDomain && subDomain
    ? `${subDomain}-${prefix.toLowerCase()}.${hostDomain}`
    : `${deployment.replace('_', '-')}.localhost`

  process.stdout.write(ingressHost)

})()
