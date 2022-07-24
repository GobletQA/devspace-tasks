
import { TInRepos, TInRepo, TRepo, TRepos, TReposPaths } from '../shared.types'
import {
  isStr,
  exists,
  ensureArr,
  camelCase,
  deepMerge,
  flatUnion,
  noPropArr
} from '@keg-hub/jsutils'

const resolveVal = (possible:string[]) => {
  return possible.find(item => exists(item) && isStr(item)).replace(/[^\w]/gi, '-')
}

const matchRepoPath = (key:string, alias:string[], paths:TReposPaths, rootDir:string) => {
  return alias.reduce((found, item) => found || paths[camelCase(item)], ``) || rootDir
}

// 
const getShort = (short:string, possible:string[]) => {
  return (
    short || possible.reduce((a, b) => (a.length <= b.length ? a : b))
  ).replace(/[^\w]/gi, '-')
}

export const buildRepos = (repos:TInRepos, paths:TReposPaths, rootDir:string):TRepos => {
  return Object.entries(deepMerge(repos))
    .reduce((acc, [key, repo]:[string, TInRepo]) => {
      const {
        path,
        envs,
        name,
        label,
        short,
        port,
        ports,
        image,
        alias=noPropArr,
        deployment,
        ...rest
      } = repo

      const repoName = resolveVal([name, label, deployment, key])
      const repoLabel = resolveVal([label, name, deployment, key])
      const repoDeploy = resolveVal([deployment, label, name, key])
      const repoAlias = flatUnion(
          alias,
          [name, label, short, deployment, key],
          [repoName, repoLabel, repoDeploy]
        ) as string[]

      const repoShort = getShort(short, repoAlias)
      !repoAlias.includes(repoShort) && repoAlias.push(repoShort)

      acc[key] = {
        ...rest,
        name: repoName,
        label: repoLabel,
        short: repoShort,
        alias: repoAlias,
        deployment: repoDeploy,
        // TODO: figure out if  root level envs should be joined here
        envs: deepMerge({}, envs),
        image: image || repoName,
        ports: flatUnion([port], ensureArr(ports)),
        path: path || matchRepoPath(key, repoAlias, paths, rootDir),
      } as TRepo

      return acc
    }, {})
}
