import path from 'path'
import { isStr, exists } from '@keg-hub/jsutils'

/**
 * Checks if a custom config location is passed in and returns it
 * Otherwise returns the default config location
 * @param {string} configLoc - Path to a custom devspace config file
 *
 * @returns {string} - Path to the resolve devspace config file
 */
export const getConfigPath = (configLoc, devspaceDir:string) => {
  return exists(configLoc) && isStr(configLoc)
    ? path.resolve(configLoc)
    : path.join(devspaceDir, `devspace.yaml`)
}
