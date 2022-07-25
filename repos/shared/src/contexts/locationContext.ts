import os from 'os'
import path from 'path'

export const locationContext = (location:string, rootDir:string, homeDir?:string) => {
  // If no repos dir defined assume repos are in the root directory
  if(!location) return rootDir

  // If the repo dir is an absolute path just return it 
  if(location.startsWith(`/`)) return location

  // If repos dir it relative to the home directory
  // Generate the path from the os home
  if(location.startsWith(`~/`)) return path.join(homeDir || os.homedir(), location)

  // Otherwise assume the repos directory is relative to the rootDir
  if(rootDir && !location.includes(rootDir)) return path.join(rootDir, location)

  return location
}