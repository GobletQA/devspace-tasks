import { actionTypes } from './constants'
import { TaskConfig } from '@TSKShared/shared.types'
import { TState, TAction, TActions } from './store.types'

export const actions:TActions = {
  [actionTypes.SET_CONFIG]: (state:TState, action:TAction) => {
    return action.payload
      ? {...state, config: action.payload as TaskConfig}
      : state
  }
}

