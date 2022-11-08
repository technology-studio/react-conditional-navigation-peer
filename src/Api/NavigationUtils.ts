/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-02T14:11:69+01:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationAction,
  NavigationState,
  PartialRoute,
  PartialState,
  Route,
} from '@react-navigation/native'

export const getActiveLeafNavigationNode = (state: NavigationState): NavigationState => {
  const { routes, index } = state
  const currentRoute = routes[index]
  if (currentRoute.routes) {
    return getActiveLeafNavigationNode(currentRoute.routes)
  }
  return currentRoute
}

export const getExistingNavigationNodeByRouteName = (state: NavigationState | PartialState<NavigationState> | undefined, routeName: string): PartialRoute<Route<string>> | Route<string> | undefined => {
  if (!state) {
    return undefined
  }
  const { routes, index } = state
  const currentRoute = typeof index === 'number' ? routes[index] : undefined
  if (currentRoute?.name === routeName) {
    return currentRoute
  }
  if (currentRoute?.routes) {
    return getExistingNavigationNodeByRouteName(currentRoute.routes, routeName)
  }
  return undefined
}

type Params = { screen?: string, params?: Params }

export const getNextNestedScreenList = (params: Params | undefined): string[] | undefined => {
  if (!params) {
    return undefined
  }
  const { params: innerParams, screen } = params
  if (!screen) {
    return undefined
  }
  if (innerParams) {
    const nextScreen = getNextNestedScreenList(innerParams)
    return nextScreen ? [screen, ...nextScreen] : [screen]
  }
  return [screen]
}

export const getNavigationPathFromAction = (action: NavigationAction): string[] | undefined => {
  const { payload } = action
  if (!payload) {
    return undefined
  }
  const { params, name } = payload as { params?: Params, name: string }
  const nextScreen = getNextNestedScreenList(params)
  return nextScreen ? [name, ...nextScreen] : [name]
}

export const getActiveScreenPath = (
  state: NavigationState | undefined,
  tempIndex = 0,
): string[] | undefined => {
  if (!state) {
    return undefined
  }
  const { routes, index, type } = state
  if (!index) {
    return undefined
  }
  if (type === 'stack' && tempIndex < index) {
    const nextPath = getActiveScreenPath(state, tempIndex + 1)
    return nextPath ? [routes[tempIndex].name, ...nextPath] : [routes[tempIndex].name]
  } else if (type === 'tab' || type === 'stack') {
    // TODO: resolve typescript issues with routes not containing nested routes
    const nextPath = getActiveScreenPath(routes[index])
    return nextPath ? [routes[index].name, ...nextPath] : [routes[index].name]
  }
  return undefined
}

export const getStateNearestRouteKeyByRouteName = (state: NavigationState | null | undefined, name: string): string | undefined => {
  const route = state?.routes?.find(route => route.name === name)
  return route ? route.key : undefined
}
