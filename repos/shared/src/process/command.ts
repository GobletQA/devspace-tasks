import { loadEnvs } from '../envs/loadEnvs'
import { runCmd, Logger } from '@keg-hub/cli-utils'
import { processError } from '../process/processError'
import { ensureArr, noOpObj, noPropArr, isObj, parseJSON } from '@keg-hub/jsutils'
import { TCmdMethod, TCmd, TCmdParams, TCmdResp, TExecResp } from './process.types'


/**
 * Gets a list of current pm2 processes being run
 *
 * @returns {Promise<Array>} - List of current pm2 processes
 */
export const pm2Status = async ():Promise<Record<string, any>[]> => {
  const { data } = await runCmd(`pm2`, [`jlist`], { exec: true })
  return parseJSON(data) || noPropArr
}

/**
 * Removes the a running PM2 daemonized process if it exists
 * @param {string} name - Name used to reference the PM2 process
 * @param {Object} opts - Extra options to pass to the child process
 *
 * @returns {Promise<void>}
 */
export const cleanPm2Daemon = async (name, opts = noOpObj):Promise<void> => {
  try {
    // Remove any existing pm2 daemons that may already be running
    await runCmd(`pm2`, [`delete`, name], opts)
    // Clean up old pm2 logs
    await runCmd(`pm2`, [`flush`], opts)
  }
  catch (err) {
    Logger.info(`Could not cleanup ${name} daemon, skipping`)
  }
}

/**
 * Starts a command as a daemon using PM2 to daemonize it
 * @param {string} executable - Process to be daemonized
 * @param {Array} args - Arguments to pass to the executable
 * @param {Object} opts - Extra options to pass to the child process
 * @param {string} name - Name used to reference the PM2 process
 * @param {boolean} watch - Attach to the pm2 logs of the process after starting it
 *
 * @returns {Promise<*>} - Response from the PM2 command
 */
export const startPm2Daemon = async (
  executable:string,
  args: string[],
  opts:Record<any, any>,
  name:string,
  watch?:boolean
):Promise<TCmdResp> => {

  opts = opts || noOpObj

  Logger.log(`\nUsing pm2 to run ${executable} as a daemon...\n`)

  const daemonResp = await runCmd(
    `pm2`,
    [`start`, executable, `--name`, name, `--`].concat(args),
    { ...opts, exec: true }
  )

  if (!watch) return daemonResp

  // After running the command as a daemon, connect to the log output
  // This allows watching the script start up
  Logger.log(
    `\nThe ${executable} daemon started successfully, connecting to log output...\n`
  )
  return await runCmd(`pm2`, [`logs`, name], opts)
}

/**
 * Runs a command in a sub-process and returns the output
 * Exits the process if the devspace command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - arguments to pass to the executable when run
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
export const command = (executable:string):TCmdMethod => {
  return async (
    cmd:TCmd,
    params:TCmdParams,
    validExitCode?:string[]
  ) => {
    const {
      cwd,
      env,
      log,
      exec,
      envs,
      watch,
      daemon,
    } = params
  
    const args = ensureArr(cmd)

    log && Logger.pair(`Running Cmd:`, `${executable} ${args.join(' ')}\n`)

    const opts = {
      cwd,
      log,
      exec,
      envs: { ...loadEnvs(env), ...envs },
    }

    /**
     * Regardless of running as a daemon
     * We still want to kill a currently running daemon
     * Otherwise daemon or not the process may not restart properly, because it's already running
     * So always delete an existing PM2 daemon if it exists
     */
    const pm2Name = `${executable}-${args[0]}`
    await cleanPm2Daemon(pm2Name, { ...opts, exec: true })

    const output = daemon
      ? await startPm2Daemon(executable, args, opts, pm2Name, watch)
      : await runCmd(executable, args, opts) as TCmdResp

    if (typeof output !== 'object')
      return output as string | number

    const { data, error, exitCode } = output as TExecResp

    exitCode &&
      validExitCode &&
      !ensureArr(validExitCode).includes(exitCode) &&
      processError(error, exitCode, log)

    log && data && Logger.pair(`Cmd Output:\n`, data)

    return data as string
  }
}

module.exports = {
  command,
  pm2Status,
  cleanPm2Daemon,
  startPm2Daemon,
}
