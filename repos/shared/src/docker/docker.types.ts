import { TEnv } from '../shared.types'

export type TTagOpts = {
  env: TEnv,
  node: string,
  commit: string
  branch: string
  package: string
  values: string,
}