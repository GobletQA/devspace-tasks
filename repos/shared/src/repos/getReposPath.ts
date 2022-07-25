import { locationContext } from '../contexts/locationContext'

/**
 * Gets the absolute path to the repos directory
 * Works with absolute paths, relative to repo root, and users home directory,
 */
export const getReposPath = (rootDir:string, reposDir?:string, homedir?:string) => {
  const absLoc = locationContext(rootDir, reposDir, homedir)
  return absLoc || rootDir
}