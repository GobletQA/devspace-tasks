import { TSelectors, TRepo } from '../shared.types'
import { TDSConfig, TDeployOpts, TDeployArr, TActiveDeploys } from './devspace.types'


/**
 * Gets the all deployment options
 * @param {Object} config - DevSpace deployment config 
 * @return {Array} - All allow apps that can be deployed as object and array
 */
export const getDeploymentOpts = (config: TDSConfig):TDeployOpts => {
  const { repos } = config

  const activeMap = {}
  const deployObj = Object.entries(repos)
    .reduce((acc, [name, repo]:[string, TRepo]) => {
      acc[repo.deployment] = repo.alias
      activeMap[repo.deployment] = `DS_${repo.short}_ACTIVE`.toUpperCase()

      return acc
    }, {} as TSelectors)

  return [
    deployObj as TSelectors,
    Object.keys(activeMap) as TDeployArr,
    activeMap as TActiveDeploys
  ]
}
