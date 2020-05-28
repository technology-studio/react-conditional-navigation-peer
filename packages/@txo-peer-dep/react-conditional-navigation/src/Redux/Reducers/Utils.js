/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T14:00:55+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import {
  type NavigationState,
  type NavigationRoute,
  type NavigationRouter,
} from 'react-navigation'
import { Log } from '@txo/log'

import type { Condition } from '../../Model/Types'

import { type ConditionalNavigationState } from '../Types/NavigationReduxTypes'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.Utils')

export const getStateCurrentRoute = (state: ?NavigationState): ?NavigationRoute => {
  return state && state.routes && state.routes[state.index]
}

export const getStateCurrentRouteKey = (state: ?NavigationState): ?string => {
  const navigationRoute = getStateCurrentRoute(state)
  return navigationRoute ? navigationRoute.key : null
}

export const getStateNearestRouteKeyByRouteName = (state: ?NavigationState, routeName: string): string | void => {
  const route = state && state.routes && state.routes.find(route => route.routeName === routeName)
  return route ? route.key : undefined
}

export const extractScreenNavigationConditions = <STATE: NavigationState>(
  router: NavigationRouter<STATE, *>,
  state: ?STATE,
  action: *,
  rootState: *,
): ?Condition[] => {
  const tempState = router.getStateForAction(action, state)
  if (tempState) {
    const tempNavigation = {
      state: tempState.routes[tempState.index],
      addListener: () => {},
      dispatch: () => false,
    }
    const screenOptions = router.getScreenOptions(tempNavigation, {})
    log.debug('EXTRACTED SCREEN OPTIONS', { screenOptions, state: tempState, action })
    return typeof screenOptions.conditions === 'function'
      ? screenOptions.conditions(rootState)
      : screenOptions.conditions
  }
}

export const addConditionalNavigationToState = <STATE: NavigationState>(
  state: STATE, conditionalNavigation: ConditionalNavigationState,
): STATE => {
  const { index, routes } = state
  return {
    ...state,
    routes: routes.map((route, _index: number) => index === _index
      ? {
        ...route,
        conditionalNavigation,
      }
      : route,
    ),
  }
}
