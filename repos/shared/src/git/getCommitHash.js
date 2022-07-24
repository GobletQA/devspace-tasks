const { git } = require('./git')

/**
 * Gets the current short commit hash
 */
const getCommitHash = async () => {
  const output = await git([`rev-parse`, `--short`, `HEAD`])
  return output.replace(/\n\t\s/, '').trim()
}

module.exports = {
  getCommitHash,
}
