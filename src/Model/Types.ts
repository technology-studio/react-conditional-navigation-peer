/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T03:01:48+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationAction,
  PartialState,
} from '@react-navigation/native'
import type { NavigationState } from '@react-navigation/routers'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import type { ValuesType } from 'utility-types'

import type { ConditionalNavigationState } from '../Redux/Types/NavigationReduxTypes'

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

export type ActionCreatorAttributes = {
  action: NavigationAction,
  getState: () => NavigationState | PartialState<NavigationState> | undefined,
  nextOnAction: (...args: any) => boolean,
  originalOnAction: (...args: any) => boolean,
  restArgs: any[],
  screenConditionsMap: Record<string, Condition[]>,
  setState: (state: NavigationState | PartialState<NavigationState> | undefined) => void,
}
