/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-12T18:34:31+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import {
  NavigationActions as navigationCreators,
  type NavigationRouter,
  type NavigationState,
} from 'react-navigation'
import { Log } from '@txo/log'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'

import { SUBSCRIBERS_KEY } from '../Model'
import type {
  NavigationReducer,
  RootStateFragment,
} from '../Model/Types'

import { creators as internalCreators } from './Creators'
import {
  backReducer,
  navigateReducer,
  cancelFlowReducer,
  finishFlowAndContinueRedurer,
  requireConditionsReducer,
  validateConditionsReducer,
  setParamsReducer,
  allReducer,
} from './Reducers'

import {
  type Creators,
  types,
} from './Types/NavigationReduxTypes'

/* ------------- Types and Action Creators ------------- */

export const creators: Creators = {
  ...(navigationCreators: any),
  ...internalCreators,
}

const log = new Log('txo.react-conditional-navigation.Redux.navigationReducer')

/* ------------- Reducers ------------- */
// TODO: add support for multi level routes conditional navigation. At this moment we support only 1st level of routes for conditional navigation.

const initAction = navigationCreators.init()

export const createNavigationReducer = <STATE: NavigationState, ROOT_STATE>(router: NavigationRouter<STATE, *>): NavigationReducer<?STATE, *, ROOT_STATE> => {
  const initialState = router.getStateForAction(initAction, null)
  const reducer = (state: ?STATE = initialState, action: any, rootState: ROOT_STATE): ?STATE => {
    if (action.type.startsWith('Navigation/')) {
      log.debug('NAVIGATION REDUCER: ' + action.type, { preview: action.type, action, state, rootState })
    }
    const actionReducer = {
      [types.BACK]: backReducer,
      [types.NAVIGATE]: navigateReducer,
      [types.SET_PARAMS]: setParamsReducer,
      [types.CANCEL_FLOW]: cancelFlowReducer,
      [types.FINISH_FLOW_AND_CONTINUE]: finishFlowAndContinueRedurer,
      [types.REQUIRE_CONDITIONS]: requireConditionsReducer,
      [types.VALIDATE_CONDITIONS]: validateConditionsReducer,
      [types.ALL]: allReducer,
    }[action.type]

    if (actionReducer) {
      return actionReducer(router, reducer, state, action, rootState)
    }

    const newState = router.getStateForAction(action, state)
    return newState || state
  }
  return reducer
}

export const createNavigationMiddleware = <STATE: RootStateFragment>(): Middleware<STATE, *, *> => (
  createReactNavigationReduxMiddleware(
    state => state.navigation,
    SUBSCRIBERS_KEY,
  )
)
