import { TEnvs } from '../shared.types'

export type TCmd = string | string[]

export type TExecResp = {
  data: string
  error: string
  exitCode: number
}

export type TCmdResp = TExecResp | string | number

export type TCmdParams = {
  envs?:TEnvs
  cwd?: string
  env?: string
  log?: boolean
  exec?: boolean
  watch?: boolean
  daemon?: boolean
}

export type TCmdMethod = (
    cmd:TCmd,
    params:TCmdParams,
    validExitCode?:string[]
  ) => Promise<TCmdResp>