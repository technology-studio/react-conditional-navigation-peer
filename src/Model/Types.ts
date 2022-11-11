/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T03:01:48+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationAction,
} from '@react-navigation/native'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'
import type { NavigationState } from '@react-navigation/routers'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import type { ValuesType } from 'utility-types'

export type ConditionalNavigationState<STATE> = {
  condition: Condition,
  logicalTimestamp: number,
  postponedAction: NavigationAction | null,
  previousState: STATE,
}

export type NavigationReducer<S, A, RS> = (state: S, action: A, rootState: RS) => S

export type RootStateFragment = { navigation: NavigationState }

declare module '@txo-peer-dep/redux/lib/Model/Types' {
  export interface DefaultRootState {
    navigation: NavigationState,
  }
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
    conditionalNavigation?: ConditionalNavigationState<DefaultRootState['navigation']>,
  }
}

export type RouterOptions<ROOT_STATE = DefaultRootState> = {
  conditions: Condition[] | ((rootState: ROOT_STATE) => Condition[]),
}

export type UseOnActionOptions = Parameters<typeof UseOnActionType>[0]
export type OnAction = ReturnType<typeof UseOnActionType>
type RestArgs = Parameters<OnAction> extends [Parameters<OnAction>[0], ...infer R] ? R : never

export type ActionCreatorAttributes = {
  action: NavigationAction,
  getState: UseOnActionOptions['getState'],
  nextOnAction: OnAction,
  originalOnAction: OnAction,
  restArgs: RestArgs,
  screenConditionsMap: Record<string, Condition[]>,
  setState: UseOnActionOptions['setState'],
}

export type OnActionFactoryAttributes = {
  getState: UseOnActionOptions['getState'],
  nextOnAction: OnAction,
  screenConditionsMap: Record<string, Condition[]>,
  setState: UseOnActionOptions['setState'],
}
