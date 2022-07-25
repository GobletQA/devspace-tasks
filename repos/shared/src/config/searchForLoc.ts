import path from 'path'
import fs from 'fs'
import { fdir } from 'fdir'
import { TSearchLocArgs } from '../shared.types'
import { locationContext } from '../contexts/locationContext'

const crawler = new fdir()

/**
 * Checks if the passed in path includes the passed in file
 */
const matchesLoc = (file:string, path:string) => {
  return path.includes(file)
}

/**
 * Excludes node_modules when searching for a file
 */
const excludeDirs = (dirName:string, dirPath:string) => {
  return dirName.includes(`node_modules`)
}

/**
 * Tries to find the absolute path to a location of file
 */
export const searchForLoc = ({
  loc,
  type,
  asDir,
  rootDir,
  file=loc,
  fallback,
}: TSearchLocArgs): string => {

  // If a location is passed, ensure we get the absolute pack and return
  if(loc) return locationContext(loc, rootDir)

  const files = crawler
    .withFullPaths()
    .filter((path:string, isDir:boolean) => matchesLoc(file, path))
    .exclude(excludeDirs)
    // .glob(file)
    .crawl(rootDir)
    .sync() as string[]

  const found = files.length ? files[0] : locationContext(fallback, rootDir)
  if(!found)
    throw new Error(`Could not find ${type} at location ${file} or fallback ${fallback}`)

  return !asDir || fs.lstatSync(found).isDirectory() 
    ? found
    : path.dirname(found)
}