import os from 'os'
import path from 'path'

export const getReposPath = (rootDir:string, reposDir?:string, homedir?:string) => {
  if(!reposDir) return path.join(rootDir, `repos`)

  if(reposDir.startsWith(`/`)) return reposDir

  if(reposDir.startsWith(`~/`)){
    homedir = homedir || os.homedir()
    return path.join(homedir, reposDir)
  }

  return path.join(rootDir, reposDir)
}