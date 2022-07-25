import path from 'path'
import { TTagOpts } from './docker.types'
import { noOpObj } from '@keg-hub/jsutils'
import { loadEnvs } from '../envs/loadEnvs'
import { getEnvImgTag } from './getEnvImgTag'
import { getCommitHash } from '../git/getCommitHash'
import { getRepoPackage } from '../repos/getRepoPackage'
import { getCurrentBranch } from '../git/getCurrentBranch'
import { TaskConfig, TTaskParams, TEnv } from '../shared.types'

/**
 * Gets all the available options for tagging an image
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 * @param {Object} envs - Key/Value pairs of envs loaded from the values files
 *
 * @return {Object} - Resolved tagging option values
 */
export const getTagOptions = async (
  params:TTaskParams = noOpObj,
  docFileCtx:string = ``,
  envs,
  config:TaskConfig
):Promise<TTagOpts> => {
  const { version } = getRepoPackage({ repo: config.repos.root, config })

  envs = envs || loadEnvs(params.env, config)
  const commit = await getCommitHash(config)
  const branch = await getCurrentBranch(config)

  return {
    commit,
    branch,
    package: version,
    node: process.env.NODE_ENV || envs.NODE_ENV,
    env: process.env.ENVIRONMENT as TEnv || params.env,
    values: await getEnvImgTag(params, docFileCtx, envs, config) as string,
  }
}

