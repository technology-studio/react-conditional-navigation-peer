/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-12T18:34:31+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import {
  NavigationActions as navigationCreators,
  type NavigationRouter,
  type NavigationState,
  type NavigationAction as RNNavigationAction,
} from 'react-navigation'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import { Log } from '@txo/log'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import type {
  AnyAction,
  Middleware,
  Reducer,
} from 'redux'

import { SUBSCRIBERS_KEY } from '../Model'
import type {
  NavigationReducer,
  RootStateFragment,
  RouterOptions,
} from '../Model/Types'

import { creators as internalCreators } from './Creators'
import {
  backReducer,
  navigateReducer,
  cancelFlowReducer,
  finishFlowAndContinueReducer,
  requireConditionsReducer,
  validateConditionsReducer,
  setParamsReducer,
  allReducer,
} from './Reducers'
import type {
  NavigationAction, NavigationCancelFlowAction, NavigationFinishFlowAndContinueAction,
} from './Types/NavigationReduxTypes'
import {
  type Creators,
  types,
} from './Types/NavigationReduxTypes'

/* ------------- Types and Action Creators ------------- */

export const creators: Creators = {
  ...navigationCreators,
  ...internalCreators,
}

const log = new Log('txo.react-conditional-navigation.Redux.navigationReducer')

/* ------------- Reducers ------------- */
// TODO: add support for multi level routes conditional navigation. At this moment we support only 1st level of routes for conditional navigation.

const initAction = navigationCreators.init()

const isCustomNavigationAction = (action: NavigationAction | RNNavigationAction): action is NavigationAction => (
  typeof action.type === 'string' && action.type.startsWith('Navigation/')
)

export const createNavigationReducer = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(router: NavigationRouter<STATE, RouterOptions<ROOT_STATE>>): NavigationReducer<STATE | null, NavigationAction | RNNavigationAction, ROOT_STATE> => {
  const initialState = router.getStateForAction(initAction, undefined)
  // const reducer = (state: STATE | null = initialState, action: NavigationAction | RNNavigationAction, rootState: ROOT_STATE): STATE | null => {
  const reducer: NavigationReducer<STATE | null, NavigationAction | RNNavigationAction, ROOT_STATE> = (state: STATE | null = initialState, action: NavigationAction | RNNavigationAction, rootState: ROOT_STATE): STATE | null => {
    const actionReducer = {
      [types.BACK]: backReducer,
      [types.NAVIGATE]: navigateReducer,
      [types.SET_PARAMS]: setParamsReducer,
      [types.CANCEL_FLOW]: (cancelFlowReducer as <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
        router: NavigationRouter<STATE>,
        parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
        state: STATE | null,
        action: NavigationCancelFlowAction,
        rootState: ROOT_STATE
      ) => STATE | null),
      [types.FINISH_FLOW_AND_CONTINUE]: (finishFlowAndContinueReducer as <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
        router: NavigationRouter<STATE>,
        parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
        state: STATE | null,
        action: NavigationFinishFlowAndContinueAction,
        rootState: ROOT_STATE
      ) => STATE | null),
      [types.REQUIRE_CONDITIONS]: requireConditionsReducer,
      [types.VALIDATE_CONDITIONS]: validateConditionsReducer,
      [types.ALL]: allReducer,
    }[action.type]

    if (actionReducer && isCustomNavigationAction(action) && state) {
      log.debug(`NAVIGATION REDUCER: ${action.type}`, { preview: action.type, action, state, rootState })
      // @ts-expect-error -- TODO: find out why action argument gets reduced to never type - Type 'NavigationVoidAction' is not assignable to type 'never'. ts(2345)
      return actionReducer(router, reducer as Reducer<STATE | null, typeof action>, state, action, rootState)
    }
    const newState = router.getStateForAction(action as RNNavigationAction, state ?? undefined)
    return newState ?? state
  }
  return reducer
}

export const createNavigationMiddleware = <STATE extends RootStateFragment>(): Middleware<STATE> => (
  createReactNavigationReduxMiddleware(
    (state: STATE) => state.navigation,
    SUBSCRIBERS_KEY,
  )
)
