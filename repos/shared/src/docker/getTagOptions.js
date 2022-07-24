const path = require('path')
const { appRoot } = require('../../paths')
const { noOpObj } = require('@keg-hub/jsutils')
const { loadEnvs } = require('../envs/loadEnvs')
const { getEnvImgTag } = require('./getEnvImgTag')
const { getCommitHash } = require('../git/getCommitHash')
const { getCurrentBranch } = require('../git/getCurrentBranch')
const { version } = require(path.join(appRoot, `package.json`))

/**
 * Gets all the available options for tagging an image
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 * @param {Object} envs - Key/Value pairs of envs loaded from the values files
 *
 * @return {Object} - Resolved tagging option values
 */
const getTagOptions = async (params = noOpObj, docFileCtx = ``, envs) => {
  envs = envs || loadEnvs(params.env)
  const commit = await getCommitHash()
  const branch = await getCurrentBranch()

  return {
    commit,
    branch,
    package: version,
    env: process.env.ENVIRONMENT || params.env,
    node: process.env.NODE_ENV || envs.NODE_ENV,
    values: await getEnvImgTag(params, docFileCtx, envs),
  }
}

module.exports = {
  getTagOptions,
}
