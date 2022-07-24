import { TTagOpts } from './docker.types'
import { loadEnvs } from '../envs/loadEnvs'
import { getTagOptions } from './getTagOptions'
import { resolveImgName } from './resolveImgName'
import { ensureArr, noOpObj, flatUnion } from '@keg-hub/jsutils'
import { TaskConfig, TTaskParams, TEnvs } from '../shared.types'

/**
 * Parses the tagMatch argument and checks if there is a branch match
 * If there is then is adds the tag types to the tags array
 * @param {Object} params - Passed in task options, converted into an object
 
 * @return {Array} All tags types to be added to the docker image
 */
const generateTagMatches = (
  params:TTaskParams,
  docFileCtx:string,
  envs:TEnvs,
  tagOptions:TTagOpts,
  config:TaskConfig
):string[] => {
  const shortContext = config?.repos[docFileCtx || 'root']?.short
  const tags = flatUnion(
    ensureArr(params.tag),
    ensureArr(envs.IMAGE_BUILD_TAGS),
    ensureArr(envs[`DS_${docFileCtx.toUpperCase()}_BUILD_TAGS`] || []),
    shortContext && ensureArr(envs[`DS_${shortContext.toUpperCase()}_BUILD_TAGS`] || [])
  )

  if (!params.tagMatch) return tags

  const { tagMatch } = params
  const [branch, tag] = (tagMatch as string).split(`:`)

  return tagOptions.branch === branch ? tags.concat(tag.split(',')) : tags
}

/**
 * Generates the docker build image tags based on passed in params
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Array} - Generated tags to be passed to the docker build command
 */
export const resolveImgTags = async (
  params:TTaskParams = noOpObj,
  docFileCtx:string = ``,
  envs:TEnvs,
  config:TaskConfig
):Promise<string[]> => {
  const { env } = params

  envs = envs || loadEnvs(env)
  const tagOptions = await getTagOptions(params, docFileCtx, envs, config)
  const tagArr = generateTagMatches(params, docFileCtx, envs, tagOptions, config)

  if (!tagArr.length) tagArr.push(`package`)

  const imageName = resolveImgName((params = noOpObj), docFileCtx, envs, config)

  return tagArr.reduce((imgTags, tag) => {
    const value = (tagOptions[tag] || tag).replace(/\s\n\t:\/\\/g, '.')

    value && imgTags.push(`--tag`, `${imageName}:${value}`)

    return imgTags
  }, [])
}
