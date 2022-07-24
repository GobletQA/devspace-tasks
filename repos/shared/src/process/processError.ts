import { Logger } from '@keg-hub/cli-utils'

/**
 * Logs and error if log argument is true, then exits the current process
 * @function
 * @private
 * @exits
 * @param {string} error - Error message from the devspace command
 * @param {number} [exitCode=1] - Exit code of the devspace command
 *
 * @returns {Void}
 */
export const processError = (error:string, exitCode:number = 1, log:boolean = true) => {
  error && log && Logger.error(error)
  Logger.empty()

  process.exit(exitCode)
}
