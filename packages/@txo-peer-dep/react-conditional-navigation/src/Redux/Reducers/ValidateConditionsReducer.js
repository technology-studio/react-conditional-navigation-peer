/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:26:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { NavigationRouter, NavigationState } from 'react-navigation'
import { Log } from '@txo-peer-dep/log'

import { conditionalNavigationManager } from '../../Api/ConditionalNavigationManager'
import type { NavigationReducer } from '../../Model/Types'

import {
  type NavigationAction,
  type NavigationValidateConditionsAction,
} from '../Types/NavigationReduxTypes'

import {
  addConditionalNavigationToState,
  extractScreenNavigationConditions,
} from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.validateConditionsReducer')

export const validateConditionsReducer = <STATE: NavigationState, ROOT_STATE>(
  router: NavigationRouter<STATE, *>,
  parentReducer: NavigationReducer<?STATE, *, ROOT_STATE>,
  state: ?STATE,
  action: NavigationValidateConditionsAction,
  rootState: ROOT_STATE,
): ?STATE => {
  log.debug('VALIDATE CONDITIONS', { state, action })

  const conditionList = extractScreenNavigationConditions(router, state, action, rootState)
  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action)
    log.debug('VC: RESOLVE CONDITIONS RESULT', { conditionList, resolveConditionsResult, action })
    if (resolveConditionsResult && state) {
      const interceptedState = addConditionalNavigationToState(
        state, resolveConditionsResult.conditionalNavigationState,
      )
      return parentReducer(interceptedState, (resolveConditionsResult.navigationAction: NavigationAction), rootState)
    }
  }

  return state
}
