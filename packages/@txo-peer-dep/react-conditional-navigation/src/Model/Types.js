/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T03:01:48+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { NavigationState } from 'react-navigation'

export type NavigationReducer<S, A, RS> = (state: S | void, action: A, rootState: RS) => S

export type RootStateFragment = { navigation: NavigationState }

export type Condition = {
  key: string,
}

export const navigatorTypes = {
  STACK: 'STACK',
  TAB: 'TAB',
}

export type NavigatorType = $Values<typeof navigatorTypes>
