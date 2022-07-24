const { appRoot } = require('../../paths')
const { command } = require('../process/command')
const { deepMerge, noOpObj } = require('@keg-hub/jsutils')

/**
 * Runs a git command and returns the output
 * Exits the process if the git command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - Git command to run split as an array
 * @param {Object} opts - Options to pass to the child process
 *
 * @returns {Void}
 */
const gitCmd = command('git')
const git = (cmd, params = noOpObj) =>
  gitCmd(cmd, deepMerge({ exec: true, cwd: appRoot }, params))


module.exports = {
  git
}
