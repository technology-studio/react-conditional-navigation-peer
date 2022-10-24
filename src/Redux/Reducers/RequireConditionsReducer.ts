/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:26:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationRouter, NavigationState,
} from 'react-navigation'
import { Log } from '@txo/log'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import type { AnyAction } from 'redux'

import type { NavigationReducer } from '../../Model/Types'
import { conditionalNavigationManager } from '../../Api/ConditionalNavigationManager'
import type {
  NavigationRequireConditionsAction,
} from '../Types/NavigationReduxTypes'

import { addConditionalNavigationToState } from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.requireConditionsReducer')

export const requireConditionsReducer = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
  router: NavigationRouter<STATE>,
  parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
  state: STATE | null,
  action: NavigationRequireConditionsAction,
  rootState: ROOT_STATE,
): STATE | null => {
  const { conditionList, promiseCallbacks } = action
  log.debug('RC: START', { state, action })

  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action, rootState)
    log.debug('RC: RESOLVE CONDITIONS RESULT', { conditionList, resolveConditionsResult, action })
    if (resolveConditionsResult && state) {
      const interceptedState = addConditionalNavigationToState(
        state, resolveConditionsResult.conditionalNavigationState,
      )
      return parentReducer(interceptedState, (resolveConditionsResult.navigationAction), rootState)
    }
  }
  promiseCallbacks?.resolve()
  return state
}
