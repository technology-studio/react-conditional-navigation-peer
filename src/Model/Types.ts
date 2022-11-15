/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T03:01:48+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationAction,
  Router,
  RouterConfigOptions,
} from '@react-navigation/native'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'
import type { NavigationState } from '@react-navigation/routers'
import type { ValuesType } from 'utility-types'

export type ConditionalNavigationState = {
  condition: Condition,
  logicalTimestamp: number,
  postponedAction: NavigationAction | null,
  previousState: NavigationState,
}

export type ResolveConditionsResult = {
  navigationAction: NavigationAction,
  conditionalNavigationState: ConditionalNavigationState,
}

export type Condition = {
  key: string,
}

export const navigatorTypes = {
  STACK: 'STACK',
  TAB: 'TAB',
}

export type NavigatorType = ValuesType<typeof navigatorTypes>

declare module '@react-navigation/routers' {
  export interface NavigationLeafRoute {
    isInitial?: boolean,
    conditionalNavigation?: ConditionalNavigationState,
  }
}

export type UseOnActionOptions = Parameters<typeof UseOnActionType>[0]
export type OnAction = ReturnType<typeof UseOnActionType>
type RestArgs = Parameters<OnAction> extends [Parameters<OnAction>[0], ...infer R] ? R : never

export type OnActionAttributes = {
  action: NavigationAction,
  getState: UseOnActionOptions['getState'],
  nextOnAction: OnAction,
  originalOnAction: OnAction,
  restArgs: RestArgs,
  router: Router<NavigationState, NavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionsMap: Record<string, Condition[]>,
  setState: UseOnActionOptions['setState'],
}

export type OnActionFactoryAttributes = {
  getState: UseOnActionOptions['getState'],
  nextOnAction: OnAction,
  router: Router<NavigationState, NavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionsMap: Record<string, Condition[]>,
  setState: UseOnActionOptions['setState'],
}
