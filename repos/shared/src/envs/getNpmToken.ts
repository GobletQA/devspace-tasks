import path from 'path'
import { fileSys } from '@keg-hub/cli-utils'
import { TaskConfig } from '../shared.types'
import { exists, keyMap } from '@keg-hub/jsutils'


const { readFileSync } = fileSys

const NPM_RC_FILE = `.npmrc`
const AUTH_TOKEN_REF = `_authToken=`
const NPM_TOKEN_STRS = [`NPM_TOKEN`, `NPM_AUTH_TOKEN`]
const tokenTypes = keyMap([ ...NPM_TOKEN_STRS, `GIT_TOKEN`, `GIT_AUTH_TOKEN` ], true)
const authTokens = {
  ...tokenTypes,
  values: Object.values(tokenTypes)
}

/**
 * Loads the content of the passed on location
 * Then tries to parse the npm token form the content
 * @param {string} location - Path to an .npmrc file
 *
 * @returns {string|boolean} - Found NPM Token or false
 */
const loadNpmRC = (location:string):string|boolean => {
  try {
    const content = readFileSync(location).toString()
    return (
      content &&
      content.split('\n').reduce((found:string|boolean, line:string) => {
        // If already found, or not the correct line, just return
        if (found || !line.includes(AUTH_TOKEN_REF)) return found

        // Parse the token from the line
        const token = line.split(AUTH_TOKEN_REF).pop().trim()

        const filtered = Boolean(
          NPM_TOKEN_STRS.filter((ENV_TOKEN_NAME) => {
            return (
              ENV_TOKEN_NAME.includes(token) || token.includes(ENV_TOKEN_NAME)
            )
          }).length,
        )

        return filtered ? found : token
      }, false)
    )
  } catch (err) {
    return false
  }
}

/**
 * Loops over the passed in locs build a path to the locs .npmrc file
 * It then tries to load and parse the NPM_TOKEN from the file by calling loadNpmRC
 *
 * @returns {string|boolean} - Found NPM Token or false
 */
const loopFindNpmRcFile = (locs:string[]) => {
  return locs.reduce((found, loc) => {
    return found || loadNpmRC(path.join(loc, NPM_RC_FILE))
  }, false)
}

/**
 * Sets the found token value for the default and custom auth tokens
 */
const setFoundToken = (value:string, others:string[], gitToken:boolean=false) => {
  others.map(env => {
    if((env === `GIT_TOKEN` || env === `GIT_AUTH_TOKEN`) && !gitToken) return

    !process.env[env] && (process.env[env] = value)
  })

  return value
}

/**
 * Checks the canvas-app and the home directory for the .npmrc file
 * Parses the the token from the .npmrc file if it's a real token
 *
 * @returns {string|boolean} - Found NPM Token or false
 */
export const getNpmToken = (config:TaskConfig, gitToken?:boolean) => {
  const { NPM_TOKEN, GIT_TOKEN, NPM_AUTH_TOKEN } = process.env
  const { auth } = config.options
  const { repos, rootDir, homeDir } = config.paths
  const envTokens = [ ...authTokens.values, ...auth ]
  gitToken = exists(gitToken) ? gitToken : config.options?.gitToken
  

  if (exists(NPM_TOKEN))
    return setFoundToken(NPM_TOKEN, envTokens, gitToken)

  if (exists(NPM_AUTH_TOKEN))
    return setFoundToken(NPM_AUTH_TOKEN, envTokens, gitToken)

  let foundToken
  gitToken && exists(GIT_TOKEN) && (foundToken = GIT_TOKEN)

  // Try to load the token from the canvar or home directory
  foundToken =
    foundToken || loopFindNpmRcFile([...Object.values(repos), homeDir, rootDir])

  // If the token is found, then add it to the current process
  return foundToken
    ? setFoundToken(foundToken, envTokens, gitToken)
    : foundToken

}
