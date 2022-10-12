/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T02:29:22+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { Log } from '@txo/log'
import type { DefaultRootState } from 'react-redux'
import type {
  Action,
  AnyAction,
  // ReducerFromReducersMapObject,
  Reducer,
} from 'redux'
const log = new Log('txo.react-conditional-navigation.Redux.CombineReducers')

const getUndefinedStateErrorMessage = (key: string, action: AnyAction): string => {
  const actionType = action?.type
  const actionDescription =
    actionType
      ? `action "${String(actionType)}"`
      : 'an action'

  return (
    `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
    'To ignore an action, you must explicitly return the previous state. ' +
    'If you want this reducer to hold no value, you can return null instead of undefined.'
  )
}

// export const combineReducers = <O: Object, A> (reducers: O, parentStateKeys ?: ($Keys<O>)[]): CombinedReducer<$ObjMap<O, <S>(r: Reducer<S, any>) => S>, A>
// const combineReducers: <O extends string | number | symbol, A extends Action<any>>(
//   reducers: O,
//   parentStateKeys?: keyof O[]
// ) => Reducer<Record<O, <S>(r: unknown) => S>, A>
export const combineReducers = <
O extends Record<keyof STATE, Reducer<STATE>>,
STATE extends DefaultRootState,
ACTION extends Action = AnyAction,
// >(reducers: O, parentStateKeys?: (keyof O)[]): Reducer<Record<keyof Partial<O>, <S>(state: STATE, action: ACTION) => S>> => {
>(reducers: O, parentStateKeys?: (keyof O)[]): Reducer<STATE | undefined, ACTION> => {
  const reducerKeys = Object.keys(reducers) as (keyof O)[]
  const finalReducers: Partial<O> = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        log.warning(`No reducer provided for key "${String(key)}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers) as (keyof Partial<O>)[]

  const result = (state: STATE | undefined, action: ACTION): STATE | undefined => {
    let hasChanged = false
    const nextState = {} as unknown as STATE
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state?.[key as keyof STATE]
      // @ts-expect-error -- TODO: figure out why the third parameter was sent when Reducer only accepts 2 parameters
      const nextStateForKey = reducer?.(previousStateForKey, action, parentStateKeys?.includes(key) && state) as STATE[keyof STATE] | undefined
      // const nextStateForKey = reducer?.(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key as string, action)
        throw new Error(errorMessage)
      }
      nextState[key as keyof STATE] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
  return result
}
