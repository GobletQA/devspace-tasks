import path from 'path'
import { existsSync } from 'fs'
import { getRepo } from '../repos/getRepo'
import { TaskConfig } from '../shared.types'
import { getRepoLoc } from '../repos/getRepoLoc'

/**
 * Gets the Dockerfile to use based on the passed in context
 * @param {string} context - Context of the Dockerfile to use
 *
 * @returns {Array<string>} - Dockerfile path args to set the correct dockerfile
 */
export const getDockerFile = (config:TaskConfig, context?:string) => {
  const repo = getRepo({
    config,
    context,
    fallback: `root`,
  })

  const repoLoc = getRepoLoc({
    repo,
    config,
    context,
    fallback: `root`,
  })

  const dockerFileLoc = repo?.dockerFile || config?.paths?.dockerFiles || repoLoc
  let dockerFile = context && path.join(dockerFileLoc, `Dockerfile.${context}`)

  if(!existsSync(dockerFile)){
    dockerFile = path.join(dockerFileLoc, `Dockerfile`)

    if(!existsSync(dockerFile)){
      const fileLoc = path.join(dockerFileLoc, context ? `Dockerfile.${context}` : `Dockerfile`)
      throw new Error(`Could not find Docker file at location ${fileLoc}`)
    }
  }

  return [ `-f`, dockerFile]
}
