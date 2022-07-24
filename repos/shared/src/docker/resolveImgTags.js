const { loadEnvs } = require('../envs/loadEnvs')
const { getTagOptions } = require('./getTagOptions')
const { shortContextMap } = require('../../constants')
const { resolveImgName } = require('./resolveImgName')
const { ensureArr, noOpObj, flatUnion } = require('@keg-hub/jsutils')

/**
 * Parses the tagMatch argument and checks if there is a branch match
 * If there is then is adds the tag types to the tags array
 * @param {Object} params - Passed in task options, converted into an object
 
 * @return {Array} All tags types to be added to the docker image
 */
const generateTagMatches = (params, docFileCtx = ``, envs, tagOptions) => {
  const shortContext = shortContextMap[docFileCtx]
  const tags = flatUnion(
    ensureArr(params.tag),
    ensureArr(envs.IMAGE_BUILD_TAGS),
    ensureArr(envs[`DS_${docFileCtx.toUpperCase()}_BUILD_TAGS`] || []),
    shortContext && ensureArr(envs[`DS_${shortContext.toUpperCase()}_BUILD_TAGS`] || [])
  )

  if (!params.tagMatch) return tags

  const { tagMatch } = params
  const [branch, tag] = tagMatch.split(`:`)

  return tagOptions.branch === branch ? tags.concat(tag.split(',')) : tags
}

/**
 * Generates the docker build image tags based on passed in params
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Array} - Generated tags to be passed to the docker build command
 */
const resolveImgTags = async (params = noOpObj, docFileCtx = ``, envs) => {
  const { env } = params

  envs = envs || loadEnvs(env)
  const tagOptions = await getTagOptions(params, docFileCtx, envs)
  const tagArr = generateTagMatches(params, docFileCtx, envs, tagOptions)

  if (!tagArr.length) tagArr.push(`package`)

  const imageName = resolveImgName((params = noOpObj), docFileCtx, envs)

  return tagArr.reduce((imgTags, tag) => {
    const value = (tagOptions[tag] || tag).replace(/\s\n\t:\/\\/g, '.')

    value && imgTags.push(`--tag`, `${imageName}:${value}`)

    return imgTags
  }, [])
}

module.exports = {
  resolveImgTags,
}
