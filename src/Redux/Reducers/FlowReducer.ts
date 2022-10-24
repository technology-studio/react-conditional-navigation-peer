/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:18:48+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type { AnyAction } from 'redux'
import { NavigationActions as navigationCreators } from 'react-navigation'
import type {
  NavigationRouter,
  NavigationState,
} from 'react-navigation'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import { Log } from '@txo/log'

import type {
  ConditionalNavigationState,
  ConditionalNavigationRoute,
  NavigationCancelFlowAction,
  NavigationFinishFlowAndContinueAction,
  NavigationAction,
} from '../Types/NavigationReduxTypes'
import type { NavigationReducer } from '../../Model/Types'

import {
  getStateCurrentRoute, getStateCurrentRouteKey,
} from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.flowReducer')

const getConditionalNavigation = (state: NavigationState | null): ConditionalNavigationState | null => {
  const navigationRoute: ConditionalNavigationRoute | null = (getStateCurrentRoute(state) ?? null)
  return navigationRoute?.conditionalNavigation ? navigationRoute.conditionalNavigation : null
}

export const abstractFlowRedurerFactory = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
  logPrefix: string,
  conditionalNavigationReducer: (
    state: STATE | null,
    parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
    postponedAction: NavigationAction,
    action: NavigationAction,
    rootState: ROOT_STATE,
  ) => STATE | null,
) => (
    router: NavigationRouter<STATE>,
    parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
    state: STATE | null,
    action: NavigationFinishFlowAndContinueAction | NavigationCancelFlowAction,
    rootState: ROOT_STATE,
  ): STATE | null => {
    log.debug(`${logPrefix}: START`, { state, action })
    let previousState: STATE | null = null
    let currentState: STATE | null = state
    while (getStateCurrentRouteKey(previousState) !== getStateCurrentRouteKey(currentState)) {
      log.debug(`${logPrefix}: STATE ITERATION`, { previousState, currentState })
      const conditionalNavigation: ConditionalNavigationState | null = getConditionalNavigation(currentState)
      const flowConditionKey = action.flowConditionKey
      const isFlowConditionKeyEqualOrMissing = flowConditionKey == null || flowConditionKey === conditionalNavigation?.condition.key
      if (currentState && conditionalNavigation && isFlowConditionKeyEqualOrMissing) {
        log.debug(`${logPrefix}: DETECTED CONDITIONAL NAVIGATION`, { currentState, conditionalNavigation })
        const { index, routes } = currentState
        const newState: STATE = {
          ...currentState,
          routes: routes.map((route, _index: number) => {
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

export const finishFlowAndContinueReducer = abstractFlowRedurerFactory(
  'FF&C',
  (state, parentReducer, postponedAction, action, rootState) => {
    const params = 'params' in action ? action.params : undefined
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
