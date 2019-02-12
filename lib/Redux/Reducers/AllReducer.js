/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:05:36+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { NavigationRouter, NavigationState } from 'react-navigation'
import { Log } from '@txo-peer-dep/log'

import type {
  NavigationAllAction,
} from '../Types/NavigationReduxTypes'
import type { NavigationReducer } from '../../Model/Types'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.allReducer')

export const allReducer = <STATE: NavigationState, ROOT_STATE>(
  router: NavigationRouter<STATE, *>,
  parentReducer: NavigationReducer<?STATE, *, ROOT_STATE>,
  state: ?STATE,
  action: NavigationAllAction,
  rootState: ROOT_STATE,
): ?STATE => {
  log.debug('ALL: START', { state, action })
  const { actionList } = action

  return actionList.reduce(
    (previousState: ?STATE, subAction): ?STATE => {
      const newState = parentReducer(previousState, subAction, rootState) || previousState
      log.debug('ALL: NEW STATE', { previousState, newState, subAction })
      return newState
    }, state)
}
