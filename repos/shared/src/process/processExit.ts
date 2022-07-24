import { Logger } from '@keg-hub/cli-utils'
import { exists, isNum, noOpObj } from '@keg-hub/jsutils'

let eventExitStatus:Record<string, any> = noOpObj

/**
 * Returns the status of eventExitStatus
 * @type {function}
 * @public
 *
 * @returns {number} eventExitStatus - The error code returned from a child process
 */
export const getEventExitCode = () => {
  return eventExitStatus
}

/**
 * Error handler called when yarn command fails
 * @type {function}
 * @public
 * @exits
 * @param {number} exitCode - The error code returned from the yarn command
 * @param {string} repoName - Name of the repo that failed
 * @param {string} message - Error message to display
 *
 */
export const onProcessExit = (repoName:string, exitCode:number, message:string) => {
  repoName && message && Logger.error(`\n[ ${repoName} ] - ${message}\n`)

  process.exit(exitCode)
}

/**
 * Helper to automatically add exit listeners to the current process
 * Allows exiting the process in the middle of the task being run
 * @type {function}
 * @private
 *
 * @returns {void}
 */
export const addExitEvents = () => {
  Array.from([`exit`, `SIGINT`, `SIGHUP`, `SIGTERM`, `uncaughtException`]).map((event) =>
    process.on(event, (type, exitCode) => {
      !exists(eventExitStatus.code) &&
        (eventExitStatus = {
          event,
          code: isNum(type) ? type : exitCode,
          message: `Process exit from event: ${event}`,
        })
    })
  )
}
