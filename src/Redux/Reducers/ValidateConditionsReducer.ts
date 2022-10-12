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
import type { DefaultRootState } from 'react-redux'
import type { AnyAction } from 'redux'

import { conditionalNavigationManager } from '../../Api/ConditionalNavigationManager'
import type {
  NavigationReducer, RouterOptions,
} from '../../Model/Types'
import {
  type NavigationValidateConditionsAction,
} from '../Types/NavigationReduxTypes'

import {
  addConditionalNavigationToState,
  extractScreenNavigationConditions,
} from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.validateConditionsReducer')

export const validateConditionsReducer = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
  router: NavigationRouter<STATE, RouterOptions<ROOT_STATE>>,
  parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
  state: STATE | null,
  action: NavigationValidateConditionsAction,
  rootState: ROOT_STATE,
): STATE | null => {
  log.debug('VALIDATE CONDITIONS', { state, action })

  const conditionList = extractScreenNavigationConditions<STATE, ROOT_STATE>(router, state, action, rootState)
  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action, rootState)
    log.debug('VC: RESOLVE CONDITIONS RESULT', { conditionList, resolveConditionsResult, action })
    if (resolveConditionsResult && state) {
      const interceptedState = addConditionalNavigationToState(
        state, resolveConditionsResult.conditionalNavigationState,
      )
      return parentReducer(interceptedState, (resolveConditionsResult.navigationAction), rootState)
    }
  }

  return state
}
