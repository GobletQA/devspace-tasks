import fs from 'fs'
import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { TTaskParams } from '../shared.types'

/**
 * Removes the devspace cache directory if it exists at `container/.devspace`
 *
 * @return {Promise<Boolean|Error>} - Promise resolves to true if directory is removed
 */
export const removeCacheDir = ({ log }:TTaskParams, devspaceDir:string) => {
  return new Promise((res, rej) => {
    log && Logger.info(`\nRemoving devspace cache folder...`)
    fs.rmSync(path.join(devspaceDir, '.devspace'), { recursive: true, force: true })
    res(true)
  })
}
