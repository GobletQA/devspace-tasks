import { exists, isBool } from '@keg-hub/jsutils'

/**
 * Set a custom pull policy for all of the docker images used
 * Set pull to `false || never` to use a locally built image
 */
export const setPullPolicyEnv = (pull:string|boolean):void => {
  if (isBool(pull)){
    process.env.IMAGE_PULL_POLICY = pull === false ? `Never` : `Always`
    return
  }

  if (!exists(pull) || typeof pull !== 'string') return

  const compare = pull.toLowerCase()
  const policy = compare === `present` || compare === `exists` ? `IfNotPresent` : undefined
  exists(policy) && (process.env.IMAGE_PULL_POLICY = policy)

}
