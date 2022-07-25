
import { reducer } from './reducer'
import { STORE_UPDATE_EVT } from './constants'
import { EventEmitter } from 'events'
import { TaskConfig } from '@TSKShared/shared.types'
import { deepMerge, shallowEqual } from '@keg-hub/jsutils'
import { TState, TStore, TDispatch, TAction } from './store.types'

const stateEmitter = new EventEmitter()

const initialState:TState = {
  config: {} as TaskConfig
}
let __STATE = deepMerge(initialState) as TState

const getState = () => deepMerge(__STATE) as TState

const setState = (update:Partial<TState>) => {
  if(shallowEqual(__STATE, update, undefined)) return __STATE

  __STATE = update as TState
  stateEmitter.emit(STORE_UPDATE_EVT, __STATE)

  return __STATE
}

const dispatch:TDispatch = (action:TAction) => {
  setState(reducer(__STATE, action))
}

export const stateRegister = (cb:(state:TState) => void) => {
  stateEmitter.on(STORE_UPDATE_EVT, cb)
}

export const getStore = () => {
  return {
    getState,
    dispatch,
  } as TStore
}
