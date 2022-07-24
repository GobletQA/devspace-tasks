import { TSelectorObj } from '../shared.types'

export type TContextSelectors = TSelectorObj

export type TAliasContext = {
  all: string[]
  short?: Record<string, string>
  selectors?: TContextSelectors
}
