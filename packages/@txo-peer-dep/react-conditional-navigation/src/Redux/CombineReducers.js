/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T02:29:22+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { Log } from '@txo-peer-dep/log'
import {
  type Reducer,
  type CombinedReducer,
} from 'redux'
const log = new Log('txo.react-conditional-navigation.Redux.CombineReducers')

const getUndefinedStateErrorMessage = (key, action: any) => {
  const actionType = action && action.type
  const actionDescription =
    (actionType && `action "${String(actionType)}"`) || 'an action'

  return (
    `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
    'To ignore an action, you must explicitly return the previous state. ' +
    'If you want this reducer to hold no value, you can return null instead of undefined.'
  )
}

export const combineReducers = <O: Object, A>(reducers: O, parentStateKeys?: ($Keys<O>)[]): CombinedReducer<$ObjMap<O, <S>(r: Reducer<S, any>) => S>, A> => {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        log.warning(`No reducer provided for key "${key}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  return (state = {}, action) => {
    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action, parentStateKeys && parentStateKeys.indexOf(key) !== -1 && state)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
