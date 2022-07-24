const { getRepoPaths } = require('./getRepoPaths')

/**
 * Return a list of folder names from <root>/repos
 * @param {String} reposPath - Path to sub-repos folder
 * @type {function}
 * @returns {Array.<string>}
 */
export const getRepoNames = (reposPath:string):string[] => {
  return Object.values(getRepoPaths(reposPath))
    .map((path:string) => path.split('/').slice(-2).join('/'))
}


