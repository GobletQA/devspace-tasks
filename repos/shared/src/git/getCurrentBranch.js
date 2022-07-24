const { git } = require('./git')

/**
 * Gets the current branch name
 */
const getCurrentBranch = async () => {
  const output = await git([`rev-parse`, `--abbrev-ref`, `HEAD`])
  return output.replace(/\n\t\s/, '').trim()
}

module.exports = {
  getCurrentBranch,
}
