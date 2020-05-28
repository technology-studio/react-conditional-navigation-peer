/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:26:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { NavigationRouter, NavigationState } from 'react-navigation'
import { Log } from '@txo-peer-dep/log'

import type { NavigationReducer } from '../../Model/Types'
import { conditionalNavigationManager } from '../../Api/ConditionalNavigationManager'

import type {
  NavigationAction,
  NavigationRequireConditionsAction,
} from '../Types/NavigationReduxTypes'

import { addConditionalNavigationToState } from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.requireConditionsReducer')

export const requireConditionsReducer = <STATE: NavigationState, ROOT_STATE>(
  router: NavigationRouter<STATE, *>,
  parentReducer: NavigationReducer<?STATE, *, ROOT_STATE>,
  state: ?STATE,
  action: NavigationRequireConditionsAction,
  rootState: ROOT_STATE,
): ?STATE => {
  const { conditionList, promiseCallbacks } = action
  log.debug('RC: START', { state, action })

  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action)
    log.debug('RC: RESOLVE CONDITIONS RESULT', { conditionList, resolveConditionsResult, action })
    if (resolveConditionsResult && state) {
      const interceptedState = addConditionalNavigationToState(
        state, resolveConditionsResult.conditionalNavigationState
      )
      return parentReducer(interceptedState, (resolveConditionsResult.navigationAction: NavigationAction), rootState)
    }
  }
  promiseCallbacks && promiseCallbacks.resolve()
  return state
}
