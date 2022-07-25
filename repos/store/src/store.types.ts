import { TaskConfig } from '@TSKShared/shared.types'

type TRecordState = Record<any, any>

export type TState = TRecordState & {
  config?: TaskConfig
}

export type TDispatch = (action:TAction) => void

export type TStore = {
  dispatch: TDispatch
  getState: (loc:string) => any
}

export type TAction = {
  type: string
  payload: Record<any, any>
}

export type TActionMethod = (state:TState, action:TAction) => TState

export type TActions = {
  [key:string]: TActionMethod
}