import { git } from './git'
import { TaskConfig } from '../shared.types'

/**
 * Gets the current short commit hash
 */
export const getCommitHash = async (config:TaskConfig) => {
  const output = await git([`rev-parse`, `--short`, `HEAD`], undefined, config)
  return typeof output === 'number'
    ? `${output}`
    : typeof output === 'string'
      ? output.replace(/\n\t\s/, '').trim()
      : output.data.replace(/\n\t\s/, '').trim()
}
