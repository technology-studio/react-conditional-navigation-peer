/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:18:48+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { Reducer } from 'redux'
import { NavigationActions as navigationCreators } from 'react-navigation'
import type { NavigationRouter, NavigationState } from 'react-navigation'
import { Log } from '@txo/log'

import type {
  ConditionalNavigationState,
  ConditionalNavigationRoute,
  NavigationCancelFlowAction,
  NavigationFinishFlowAndContinueAction,
} from '../Types/NavigationReduxTypes'
import type { NavigationReducer } from '../../Model/Types'

import { getStateCurrentRoute, getStateCurrentRouteKey } from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.flowReducer')

const getConditionalNavigation = (state: ?NavigationState): ?ConditionalNavigationState => {
  const navigationRoute: ?ConditionalNavigationRoute = (getStateCurrentRoute(state): any)
  return navigationRoute && navigationRoute.conditionalNavigation ? navigationRoute.conditionalNavigation : null
}

export const abstractFlowRedurerFactory = <STATE: NavigationState, ROOT_STATE>(
  logPrefix: string,
  conditionalNavigationReducer: (
    state: ?STATE,
    parentReducer: NavigationReducer<?STATE, *, ROOT_STATE>,
    postponedAction: *,
    action: *,
    rootState: ROOT_STATE,
  ) => ?STATE,
) => (
    router: NavigationRouter<STATE, *>,
    parentReducer: Reducer<?STATE, *>,
    state: ?STATE,
    action: NavigationFinishFlowAndContinueAction | NavigationCancelFlowAction,
    rootState: ROOT_STATE,
  ): ?STATE => {
    log.debug(logPrefix + ': START', { state, action })
    var previousState: ?STATE = null
    var currentState: ?STATE = state
    while (getStateCurrentRouteKey(previousState) !== getStateCurrentRouteKey(currentState)) {
      log.debug(logPrefix + ': STATE ITERATION', { previousState, currentState })
      const conditionalNavigation: ?ConditionalNavigationState = getConditionalNavigation(currentState)
      const flowConditionKey = action.flowConditionKey
      const isFlowConditionKeyEqualOrMissing = flowConditionKey == null || flowConditionKey === conditionalNavigation?.condition.key
      if (currentState && conditionalNavigation && isFlowConditionKeyEqualOrMissing) {
        log.debug(logPrefix + ': DETECTED CONDITIONAL NAVIGATION', { currentState, conditionalNavigation })
        const { index, routes } = currentState
        const newState: STATE = {
          ...currentState,
          routes: routes.map((route: any, _index: number) => {
            if (index === _index) {
              const { conditionalNavigation, ..._route } = route
              return _route
            }
            return route
          }),
        }
        return conditionalNavigationReducer(newState, parentReducer, conditionalNavigation.postponedAction, action, rootState)
      }
      previousState = currentState
      if (currentState) {
        currentState = router.getStateForAction(navigationCreators.back({}), currentState)
      }
    }
    return state
  }

export const cancelFlowReducer = abstractFlowRedurerFactory(
  'CF',
  (state, parentReducer, postponedAction, action, rootState) => state,
)

export const finishFlowAndContinueRedurer = abstractFlowRedurerFactory(
  'FF&C',
  (state, parentReducer, postponedAction, { params }, rootState) => {
    log.debug('FF&C: DISPATCH POSPONED ACTION', { postponedAction, params })
    return parentReducer(
      state,
      params !== undefined
        ? {
          ...postponedAction,
          params,
        }
        : postponedAction,
      rootState,
    )
  },
)
