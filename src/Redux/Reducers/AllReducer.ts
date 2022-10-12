/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:05:36+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  AnyAction,
} from 'redux'
import type {
  NavigationRouter, NavigationState,
} from 'react-navigation'
import { Log } from '@txo/log'
import type { DefaultRootState } from 'react-redux'

import type {
  NavigationAllAction,
} from '../Types/NavigationReduxTypes'
import type { NavigationReducer } from '../../Model/Types'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.allReducer')

export const allReducer = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
  router: NavigationRouter<STATE>,
  parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
  state: STATE | null,
  action: NavigationAllAction,
  rootState: ROOT_STATE,
): STATE | null => {
  log.debug('ALL: START', { state, action })
  const { actionList } = action

  return actionList.reduce(
    (previousState: STATE | null, subAction): STATE | null => {
      const newState = parentReducer(previousState, subAction, rootState) ?? previousState
      log.debug('ALL: NEW STATE', { previousState, newState, subAction })
      return newState
    }, state)
}
