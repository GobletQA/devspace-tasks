const path = require('path')


/**
 * Gets the Dockerfile to use based on the passed in docFileCtx
 * @param {string} docFileCtx - Context of the Dockerfile to use
 *
 * @returns {Array<string>} - Dockerfile path args to set the correct dockerfile
 */
export const getDockerFile = (docFileCtx:string, devspaceDir:string) => {
  return [
    `-f`,
    path.join(devspaceDir, docFileCtx ? `Dockerfile.${docFileCtx}` : `Dockerfile`),
  ]
}
