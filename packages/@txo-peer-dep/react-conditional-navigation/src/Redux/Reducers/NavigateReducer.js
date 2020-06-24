/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:26:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import {
  NavigationActions as navigationCreators,
  StackActions as stackActions,
} from 'react-navigation'
import type { NavigationRouter, NavigationState } from 'react-navigation'
import { Log } from '@txo/log'

import { conditionalNavigationManager } from '../../Api/ConditionalNavigationManager'
import type { NavigationReducer } from '../../Model/Types'

import {
  types,
  type NavigationAction,
  type NavigationNavigateAction,
} from '../Types/NavigationReduxTypes'

import { creators } from '../Creators'

import {
  extractScreenNavigationConditions,
  addConditionalNavigationToState,
  addIsInitialToState,
} from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.navigateReducer')

const VOID = 'void'

const translatePushAction = (action: NavigationNavigateAction) => {
  if (action.push) {
    const { push, ...rest } = action
    return {
      ...rest,
      type: types.PUSH,
    }
  }
  return action
}

export const navigateReducer = <STATE: NavigationState, ROOT_STATE>(
  router: NavigationRouter<STATE, *>,
  parentReducer: NavigationReducer<?STATE, *, ROOT_STATE>,
  state: ?STATE,
  action: NavigationNavigateAction,
  rootState: ROOT_STATE,
): ?STATE => {
  const { routeName, params, flow, skipConditionalNavigation } = action
  log.info('NAVIGATE: ' + routeName, { preview: routeName })
  log.debug('NAVIGATE STATE', { preview: routeName, state, routeName, params, action })

  if (!skipConditionalNavigation) {
    const conditions = extractScreenNavigationConditions(router, state, action, rootState)
    if (conditions) {
      const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditions, action, rootState)
      log.debug('N: RESOLVE CONDITIONS RESULT', { conditions, resolveConditionsResult, action })
      if (resolveConditionsResult && state) {
        const interceptedState = addConditionalNavigationToState(
          state, resolveConditionsResult.conditionalNavigationState,
        )
        const newState = parentReducer(interceptedState, (resolveConditionsResult.navigationAction: NavigationAction), rootState)
        return addIsInitialToState(newState)
      }
    }
  }

  if (params && params.reset) {
    log.debug('NAVIGATE WITH RESET')
    const { reset, ...paramsWithoutReset } = params
    const newState = parentReducer(state, stackActions.reset({
      key: null,
      index: 0,
      actions: [
        navigationCreators.navigate({
          routeName,
          params: paramsWithoutReset,
        }),
      ],
    }), rootState)
    return addIsInitialToState(newState)
  }

  const interceptedState = flow && state
    ? addConditionalNavigationToState(state, {
      condition: {
        key: VOID,
      },
      postponedAction: creators.void(),
    })
    : state

  const newState = router.getStateForAction((translatePushAction(action): any), interceptedState)
  return addIsInitialToState(newState || state)
}
