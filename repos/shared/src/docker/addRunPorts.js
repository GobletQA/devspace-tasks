const { ensureArr, isArr, toBool, isStr } = require('@keg-hub/jsutils')
const { resolveContext } = require('../../utils/kubectl/resolveContext')

/**
 * Finds the ports to bind from the localhost to a docker container
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array} - Ports to be bound
 */
const resolveAllPorts = (params, envs, docFileCtx, config) => {
  const paramPorts = ensureArr(params.ports || [])

  // Get the context for the docker image being run
  const envPorts = ensureArr(
    resolveContext(
      docFileCtx,
      // TODO: Create a port context selector,
      // Example:
      // {
      //   [repos.backend.port]: [...backendAliases],
      //   [repos.frontend.port]: [...frontendAliases],
      // },
      // [repos.backend.port, repos.frontend.port]
      config?.selectors?.ports,
      // Make the default ALL ports
      [config?.repos.backend?.port, config?.repos.frontend?.port],
    )
  )

  return paramPorts.concat(envPorts)
}

/**
 * Checks if binding a local port to the container should be skipped
 * @param {Array} ports - Array of ports that should be bound
 *
 * @returns {Boolean} - True if ports should be bound
 */
const skipPortBind = (ports) => {
  return Boolean(!isArr(ports) || ports.map(toBool).includes(false))
}

/**
 * Gets the local ports that should be bound to the running container
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array} - Formatted port arguments to pass to the docker run cli
 */
const addRunPorts = (params, envs, docFileCtx) => {
  if (skipPortBind(params.ports)) return []

  return resolveAllPorts(params, envs, docFileCtx).reduce((acc, port) => {
    port = isStr(port) ? port : `${port}`

    port &&
      (port.includes(`:`) || port.includes(`/`)
        ? acc.push(`-p`, port)
        : acc.push(`-p`, `${port}:${port}`))

    return acc
  }, [])
}

module.exports = {
  addRunPorts,
}
