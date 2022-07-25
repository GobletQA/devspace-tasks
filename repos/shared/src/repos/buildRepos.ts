import { REPO_LOC_KEYS, REPO_LOC_FILE_MAP } from '../constants'
import { searchForLoc } from '../config/searchForLoc'
import {
  TInRepo,
  TRepo,
  TRepos,
  TaskConfig,
  TReposPaths,
  TBuildReposArgs
} from '../shared.types'
import {
  isStr,
  exists,
  ensureArr,
  camelCase,
  deepMerge,
  flatUnion,
  noPropArr,
  splitByKeys
} from '@keg-hub/jsutils'

type TRepoLocs = {
  valuesFile: string
  dockerFile: string
  configsDir: string
  devspaceDir: string
}

const searchForRepoLocs = (repoPath:string, locations:TRepoLocs, rootDir:string) => {
  const args = { rootDir, fallback: rootDir }

  return Object.entries(locations).reduce((locs, [key, location]) => {
    locs[key] = searchForLoc({
      ...args,
      type: key,
      loc: location,
      asDir: key.endsWith(`Dir`),
      file: REPO_LOC_FILE_MAP[key],
    })

    return locs
  }, {} as TRepoLocs)
}

/**
 * Resolves a value to the first value that exists in the passed in array
 * Then removes all special chars from it
 */
const resolveVal = (possible:string[]) => {
  return possible.find(item => exists(item) && isStr(item)).replace(/[^\w]/gi, '-')
}

/**
 * Tries to match a repo alias to the repo path on the filesystem
 */
const matchRepoPath = (key:string, alias:string[], paths:TReposPaths, rootDir:string) => {
  return alias.reduce((found, item) => found || paths[camelCase(item)], ``) || rootDir
}

/**
 * Gets the shortest alias for a repo based on char length
 */
const getShort = (short:string, possible:string[]) => {
  return (
    short || possible.reduce((a, b) => (a.length <= b.length ? a : b))
  ).replace(/[^\w]/gi, '-')
}

export const buildRepos = ({
  paths,
  repos,
  rootDir,
}:TBuildReposArgs):TRepos => {
  return Object.entries(deepMerge(repos))
    .reduce((acc, [key, repo]:[string, TInRepo]) => {
      const {
        path:repoLoc,
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

      const repoPath = repoLoc || matchRepoPath(key, repoAlias, paths, rootDir)
      const [locations, otherArgs] = splitByKeys(
        rest,
        REPO_LOC_KEYS
      ) as unknown as [TRepoLocs, Record<string, any>]

      acc[key] = {
        ...otherArgs,
        path: repoPath,
        name: repoName,
        label: repoLabel,
        short: repoShort,
        alias: repoAlias,
        deployment: repoDeploy,
        image: image || repoName,
        // TODO: figure out if  root level envs should be joined here
        envs: deepMerge({}, envs),
        ports: flatUnion([port], ensureArr(ports)),
        ...searchForRepoLocs(repoPath, locations, rootDir)
      } as TRepo

      return acc
    }, {})
}
