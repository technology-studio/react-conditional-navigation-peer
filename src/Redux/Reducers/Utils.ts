/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T14:00:55+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationScreenProp,
  NavigationParams,
} from 'react-navigation'
import {
  type NavigationState,
  type NavigationRoute,
  type NavigationRouter,
  type NavigationAction as RNNavigationAction,
} from 'react-navigation'
import { Log } from '@txo/log'
import type { DefaultRootState } from '@txo-peer-dep/redux'

import { configManager } from '../../Config'
import type {
  Condition, RouterOptions,
} from '../../Model/Types'
import { navigatorTypes } from '../../Model/Types'
import type { NavigationAction } from '../Types/NavigationReduxTypes'
import { type ConditionalNavigationState } from '../Types/NavigationReduxTypes'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.Utils')

export const getStateCurrentRoute = (state: NavigationState | null): NavigationRoute | undefined => state?.routes?.[state.index]

export const getStateCurrentRouteKey = (state: NavigationState | null): string | null => {
  const navigationRoute = getStateCurrentRoute(state)
  return navigationRoute ? navigationRoute.key : null
}

export const getStateNearestRouteKeyByRouteName = (state: NavigationState | null | undefined, routeName: string): string | undefined => {
  const route = state?.routes?.find(route => route.routeName === routeName)
  return route ? route.key : undefined
}

export const extractScreenNavigationConditions = <STATE extends NavigationState, ROOT_STATE = DefaultRootState>(
  router: NavigationRouter<STATE, RouterOptions<ROOT_STATE>>,
  state: STATE | null,
  action: NavigationAction | RNNavigationAction,
  rootState: ROOT_STATE,
): Condition[] | undefined => {
  const tempState = router.getStateForAction(action as RNNavigationAction, state ?? undefined)
  if (tempState) {
    const tempNavigation = {
      state: tempState.routes[tempState.index],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addListener: () => {},
      dispatch: () => false,
    } as unknown as NavigationScreenProp<NavigationRoute, NavigationParams>
    const screenOptions = router.getScreenOptions(tempNavigation, {}, 'light') // TODO: figure out which theme to use
    log.debug('EXTRACTED SCREEN OPTIONS', { screenOptions, state: tempState, action })
    return typeof screenOptions.conditions === 'function'
      ? screenOptions.conditions(rootState)
      : screenOptions.conditions
  }
}

export const addConditionalNavigationToState = <STATE extends NavigationState>(
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

const isNavigationRoute = (state: NavigationState | NavigationRoute): state is NavigationRoute => 'routeName' in state

export const injectIsInitial = <STATE extends NavigationState | NavigationRoute>(route: STATE | null, isInitial = false): STATE | null => {
  if (!route) {
    return null
  }
  const { routes, key } = route ?? {}
  const { routeNameToNavigatorTypeMap } = configManager.config
  if (isNavigationRoute(route)) {
    const { routeName } = route
    let modified = false
    const containsSplashScreen = routes[0].routeName === 'SPLASH_SCREEN'
    const nextRoutes = routes.reduce<(NavigationRoute | null)[]>((nextRoutes, subRoute, subIndex) => {
      switch (routeNameToNavigatorTypeMap[routeName || key]) {
        case navigatorTypes.STACK:
          isInitial = subIndex === (containsSplashScreen ? 1 : 0)
          break
      }
      const nextSubRoute = injectIsInitial(subRoute, isInitial)
      if (nextSubRoute !== subRoute) {
        modified = true
      }
      nextRoutes.push(nextSubRoute)
      return nextRoutes
    }, [])
    if ((route.isInitial ?? false) !== isInitial || modified) {
      return {
        ...route,
        ...(isInitial ? { isInitial: true } : {}),
        routes: modified ? nextRoutes : routes,
      }
    }
  }
  return route
}
