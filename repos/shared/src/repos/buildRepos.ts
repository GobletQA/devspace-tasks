
import { TInRepos, TInRepo, TRepo, TRepos, TConfigPaths } from '../shared.types'
import {
  isStr,
  exists,
  pickKeys,
  camelCase,
  deepMerge,
  flatUnion,
  noPropArr
} from '@keg-hub/jsutils'

type TBuiltRepos = {
  repos:TRepos
  paths: TConfigPaths
}

const resolveVal = (possible:string[]) => {
  return possible.find(item => exists(item) && isStr(item)).replace(/[^\w]/gi, '-')
}

const matchRepoPath = (key:string, repo:TInRepo, paths:TConfigPaths, rootDir:string) => {
  return [
    key,
    ...Object.values(pickKeys(repo, [`name`, `label`, `short`, `deployment`]))
  ].reduce((found, item) => found || paths[camelCase(item)], false) || rootDir
}


export const buildRepos = (repos:TInRepos, paths:TConfigPaths, rootDir:string):TBuiltRepos => {
  const built = Object.entries(deepMerge(repos))
    .reduce((acc, [key, repo]:[string, TRepo]) => {
      const {
        path,
        name,
        label,
        short,
        alias=noPropArr,
        deployment,
      } = repo

      acc[key] = {
        ...repo,
        path: path || matchRepoPath(key, repo, paths, rootDir),
        name: name || resolveVal([label, deployment, key]),
        label: label || resolveVal([name, deployment, key]),
        deployment: deployment || resolveVal([label, name, key]),
        short: short || resolveVal([name, label, deployment, key]),
        alias: flatUnion(alias, [name, label, short, deployment, key]),
      }

      return acc
    }, {})

    return { repos: built, paths }
}