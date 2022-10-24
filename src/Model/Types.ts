/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T03:01:48+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type { NavigationState } from 'react-navigation'
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

declare module 'react-navigation' {
  export interface NavigationLeafRoute {
    isInitial?: boolean,
    conditionalNavigation?: ConditionalNavigationState,
  }
}

export type RouterOptions<ROOT_STATE = DefaultRootState> = {
  conditions: Condition[] | ((rootState: ROOT_STATE) => Condition[]),
}
