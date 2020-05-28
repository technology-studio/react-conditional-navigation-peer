/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:05:36+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { Reducer } from 'redux'
import { NavigationActions as navigationCreators } from 'react-navigation'
import type { NavigationRouter, NavigationState } from 'react-navigation'
import { Log } from '@txo/log'

import type {
  NavigationBackAction,
} from '../Types/NavigationReduxTypes'

import { getStateNearestRouteKeyByRouteName } from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.backReducer')

const sequence = (count: number): number[] => {
  const result = []
  for (var index = 0; index < count; ++index) {
    result.push(index)
  }
  return result
}

export const backReducer = <STATE: NavigationState>(
  router: NavigationRouter<STATE, *>,
  parentReducer: Reducer<?STATE, *>,
  state: ?STATE,
  action: NavigationBackAction,
): ?STATE => {
  log.debug('B: START', { state, action })
  const { routeName, key, count, backToRouteName } = action

  return sequence(count || 1).reduce(
    (previousState: ?STATE): ?STATE => {
      const newKey = key || (routeName && getStateNearestRouteKeyByRouteName(previousState, routeName))
      newKey && log.debug('B: FOUND KEY', { newKey })
      const newState = router.getStateForAction(
        routeName && backToRouteName
          ? navigationCreators.navigate({ routeName, key: newKey })
          : navigationCreators.back({ key: newKey }),
        previousState,
      ) || previousState
      log.debug('B: NEW STATE', { previousState, newState })
      return newState
    }, state)
}
