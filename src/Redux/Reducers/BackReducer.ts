/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:05:36+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { Reducer } from 'redux'
import { NavigationActions as navigationCreators } from 'react-navigation'
import type {
  NavigationRouter, NavigationState,
} from 'react-navigation'
import { Log } from '@txo/log'
import type { DefaultRootState } from 'react-redux'

import type {
  NavigationBackAction,
} from '../Types/NavigationReduxTypes'

import { getStateNearestRouteKeyByRouteName } from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.backReducer')

const sequence = (count: number): number[] => {
  const result = []
  for (let index = 0; index < count; ++index) {
    result.push(index)
  }
  return result
}

export const backReducer = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
  router: NavigationRouter<STATE>,
  parentReducer: Reducer<STATE | null, NavigationBackAction>,
  state: STATE | null,
  action: NavigationBackAction,
  _rootState?: ROOT_STATE,
): STATE | null => {
  log.debug('B: START', { state, action })
  const { routeName, key, count, backToRouteName } = action

  return sequence(count ?? 1).reduce(
    (previousState: STATE | null): STATE | null => {
      const newKey = key ?? (routeName && getStateNearestRouteKeyByRouteName(previousState, routeName))
      newKey && log.debug('B: FOUND KEY', { newKey })
      const newState = router.getStateForAction(
        routeName && backToRouteName
          ? navigationCreators.navigate({ routeName, key: newKey })
          : navigationCreators.back({ key: newKey }),
        previousState ?? undefined,
      ) ?? previousState
      log.debug('B: NEW STATE', { previousState, newState })
      return newState
    }, state)
}
