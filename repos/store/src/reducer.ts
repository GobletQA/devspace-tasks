import { TState, TAction } from './store.types'
import { actions } from './actions'

export const reducer = (state:TState, action:TAction) => {
  const { type } = action
  if(!actions[type]) throw new Error(`Reducer Action ${type} does not exist!`)

  return actions[type](state, action)
}