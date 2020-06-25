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
import update from 'immutability-helper'

import { configManager } from '../../Config'
import type { Condition } from '../../Model/Types'
import { navigatorTypes } from '../../Model/Types'

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

export const addIsInitialToStateRoutes = (
  routes: Object[],
  // _currentRouteIndex?: number,
  // _isInitial?: ?boolean,
) => {
  // TODO: remove old implementation
  // const currentRouteIndex = _currentRouteIndex || 0
  // const isInitial = typeof _isInitial === 'boolean' ? _isInitial : null

  // if (routes.length === 0 || routes.length === currentRouteIndex) {
  //   return routes
  // }

  const SPLASH_SCREEN = 'SPLASH_SCREEN'
  // const route = routes[currentRouteIndex]
  // const { routeName } = route
  const { routeNameToNavigatorTypeMap } = configManager.config

  // const shouldAddIsInitial = isInitial === null
  // const isInitialAttribute = shouldAddIsInitial
  //   ? { isInitial: true }
  //   : {}

  // TODO: finish implementation
  // TODO: add checks to avoid unnecessary initializations of new objects
  // TODO: add return with the result

  routes.reduce((
    {
      routesWithIsInitial,
      isInitial,
    },
    currentRoute,
    currentIndex,
  ) => {
    const { routeName } = currentRoute
    const shouldAddIsInitial = isInitial === null
    const isInitialAttribute = shouldAddIsInitial
      ? { isInitial: true }
      : {}

    if (routeName === SPLASH_SCREEN) {
      return {
        routesWithIsInitial,
        isInitial: null,
      }
    }
    if (routeNameToNavigatorTypeMap[routeName] === navigatorTypes.TAB) {
      const editedRoutes = update(routesWithIsInitial, {
        $splice: [[
          currentIndex,
          1,
          {
            ...currentRoute,
            routes: currentRoute.routes.map(tabRoute => ({
              ...tabRoute,
              ...isInitialAttribute,
              ...(tabRoute.routes
                ? { routes: addIsInitialToStateRoutes(tabRoute.routes) }
                : {}
              ),
            })),
            ...isInitialAttribute,
          },
        ]],
      })
      return {
        routesWithIsInitial: editedRoutes,
        isInitial,
      }
    }
    if (routeNameToNavigatorTypeMap[routeName] === navigatorTypes.STACK) {
      const editedRoutes = update(routesWithIsInitial, {
        $splice: [[
          currentIndex,
          1,
          {
            ...currentRoute,
            routes: addIsInitialToStateRoutes(currentRoute.routes),
            ...isInitialAttribute,
          },
        ]],
      })
      return {
        routesWithIsInitial: editedRoutes,
        isInitial,
      }
    }
    if (shouldAddIsInitial) {
      const editedRoutes = update(routesWithIsInitial, {
        $splice: [[
          currentIndex,
          1,
          {
            ...currentRoute,
            ...isInitialAttribute,
          },
        ]],
      })
      return {
        routesWithIsInitial: editedRoutes,
        isInitial: true,
      }
    }
    if (!shouldAddIsInitial) {
      return {
        routesWithIsInitial,
        isInitial: false,
      }
    }
    // if (currentRoute.routes) {
    //   return {
    //     routesWithIsInitial: addIsInitialToStateRoutes(currentRoute.routes),
    //     isInitial,
    //   }
    // }
    // if (routeNameToNavigatorTypeMap[routeName] === navigatorTypes.TAB) {
    //   const editedTabRoutes = currentRoute.routes.map(tabRoute => ({
    //     ...tabRoute,
    //     isInitial: true,
    //   }))
    //   return {

    //   }
    // }

    return {
      routesWithIsInitial,
      isInitial,
    }
  }, { routesWithIsInitial: routes, isInitial: null })

  // TODO: remove old implementation

  // if (routeName === SPLASH_SCREEN) {
  //   return addIsInitialToStateRoutes(routes, currentRouteIndex + 1, null)
  // }
  // if (routeNameToNavigatorTypeMap[routeName] === navigatorTypes.TAB) {
  //   const editedRoutes = routes.map((route, index) => {
  //     if (index !== currentRouteIndex) {
  //       return route
  //     }
  //     return {
  //       ...route,
  //       routes: route.routes.map(tabRoute => ({
  //         ...tabRoute,
  //         isInitial: true,
  //       })),
  //       ...isInitialAttribute,
  //     }
  //   })
  //   return addIsInitialToStateRoutes(editedRoutes, currentRouteIndex + 1, shouldAddIsInitial)
  // }
  // if (routeNameToNavigatorTypeMap[routeName] === navigatorTypes.STACK) {
  //   const editedRoutes = routes.map((route, index) => {
  //     if (index !== currentRouteIndex) {
  //       return route
  //     }
  //     return {
  //       ...route,
  //       routes: addIsInitialToStateRoutes(route.routes, undefined, shouldAddIsInitial),
  //       ...isInitialAttribute,
  //     }
  //   })
  //   return addIsInitialToStateRoutes(editedRoutes, currentRouteIndex + 1, shouldAddIsInitial)
  // }
  // if (shouldAddIsInitial) {
  //   const editedRoutes = routes.map((route, index) => {
  //     if (index !== currentRouteIndex) {
  //       return route
  //     }
  //     return {
  //       ...route,
  //       ...isInitialAttribute,
  //     }
  //   })
  //   return addIsInitialToStateRoutes(editedRoutes, currentRouteIndex + 1, shouldAddIsInitial)
  // }

  // return addIsInitialToStateRoutes(routes, currentRouteIndex + 1, isInitial)
}

export const addIsInitialToState = <STATE: NavigationState>(
  state: ?STATE,
): ?STATE => {
  const { routes } = state || {}

  const editedRoutes = state && routes && addIsInitialToStateRoutes(routes)
  log.debug('addIsInitialToState', { state, routes, editedRoutes, isEqual: routes === editedRoutes })
  return state && editedRoutes && editedRoutes !== routes
    ? {
      ...state,
      routes: editedRoutes,
    }
    : state
}
