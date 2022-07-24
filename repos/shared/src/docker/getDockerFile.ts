import path from 'path'
import { getRepo } from '../repos/getRepo'
import { TaskConfig } from '../shared.types'
import { locFromContexts } from '../contexts/locFromContexts'

/**
 * Gets the Dockerfile to use based on the passed in context
 * @param {string} context - Context of the Dockerfile to use
 *
 * @returns {Array<string>} - Dockerfile path args to set the correct dockerfile
 */
export const getDockerFile = (config:TaskConfig, context:string) => {

  const args = {
    config,
    context,
    repo: undefined,
    fallback: `root`,
  }

  args.repo = getRepo(args)
  const ctxDir = locFromContexts(args, `Dockerfile.${context}`)
  const foundDir = ctxDir || locFromContexts(args, `Dockerfile`)
  const dockerFile = foundDir && path.join(foundDir, ctxDir ? `Dockerfile.${context}` : `Dockerfile`)

  if(!dockerFile) throw new Error(`Could not find Docker file at for context ${context}`)

  return [ `-f`, dockerFile]
}
