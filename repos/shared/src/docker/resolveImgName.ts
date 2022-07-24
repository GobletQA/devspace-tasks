import { error } from '@keg-hub/cli-utils'
import { resolveContext } from '../contexts/resolveContext'
import { TEnvs, TaskConfig, TTaskParams } from '../shared.types'
/**
 * Finds the correct image name to use based on the params and docFileCtx
 * @param {Object} params - Passed in task options, converted into an object
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} envs - ENV values loaded from the values.yml files
 
 * @return {string} - Resolved name of the docker image
 */
export const resolveImgName = (
  params:TTaskParams,
  docFileCtx:string,
  envs:TEnvs,
  config:TaskConfig
) => {
  const shortContext = config?.aliasContext?.short[docFileCtx]

  // Get the name of the image that will be built
  const imgName =(
    params.image ||
    (docFileCtx && envs[`DS_${docFileCtx.toUpperCase()}_IMAGE`]) ||
    (shortContext && envs[`DS_${shortContext.toUpperCase()}_IMAGE`]) ||
    resolveContext(
    docFileCtx,
      // TODO: Create an image context selector,
      config?.selectors?.images,
    )
  ) as string

  !imgName &&
    error.throwError(
      `The image argument or IMAGE env must exist to build the docker image`
    )

  // If it has a /, then it's a full image url, so just return it
  if (imgName.includes(`/`)) return imgName

  // Otherwise parse the default envs.IMAGE value to get the provider url
  // Then add the image name to the provider url
  const imgSplit = `${envs.DS_DOCKER_REGISTRY || envs.DS_IMAGE || ``}`.split('/')
  imgSplit.pop()
  imgSplit.push(imgName)

  return imgSplit.join('/')
}
