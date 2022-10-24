/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:26:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import {
  NavigationActions as navigationCreators,
  StackActions as stackActions,
} from 'react-navigation'
import type {
  NavigationRouter, NavigationState,
} from 'react-navigation'
import { Log } from '@txo/log'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import type { AnyAction } from 'redux'

import { conditionalNavigationManager } from '../../Api/ConditionalNavigationManager'
import type {
  NavigationReducer, RouterOptions,
} from '../../Model/Types'
import type {
  // NavigationAction,
  NavigationNavigateAction,
  NavigationNavigatePushAction,
} from '../Types/NavigationReduxTypes'
import {
  types,
} from '../Types/NavigationReduxTypes'
import { creators } from '../Creators'

import {
  extractScreenNavigationConditions,
  addConditionalNavigationToState,
  injectIsInitial,
} from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.navigateReducer')

const VOID = 'void'

const translatePushAction = (action: NavigationNavigateAction): NavigationNavigateAction | NavigationNavigatePushAction => {
  if (action.push) {
    const { push, ...rest } = action
    return {
      ...rest,
      type: types.PUSH,
    }
  }
  return action
}

export const navigateReducer = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
  router: NavigationRouter<STATE, RouterOptions<ROOT_STATE>>,
  parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
  state: STATE | null,
  action: NavigationNavigateAction,
  rootState: ROOT_STATE,
): STATE | null => {
  const { routeName, params, flow, skipConditionalNavigation } = action
  log.info(`NAVIGATE: ${routeName}`, { preview: routeName })
  log.debug('NAVIGATE STATE', { preview: routeName, state, routeName, params, action })

  if (!skipConditionalNavigation) {
    const conditions = extractScreenNavigationConditions<STATE, ROOT_STATE>(router, state, action, rootState)
    if (conditions) {
      const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditions, action, rootState)
      log.debug('N: RESOLVE CONDITIONS RESULT', { conditions, resolveConditionsResult, action })
      if (resolveConditionsResult && state) {
        const interceptedState = addConditionalNavigationToState(
          state, resolveConditionsResult.conditionalNavigationState,
        )
        const newState = parentReducer(interceptedState, (resolveConditionsResult.navigationAction), rootState)
        return injectIsInitial<STATE>(newState)
      }
    }
  }

  if (params?.reset) {
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
    return injectIsInitial(newState)
  }

  const interceptedState = flow && state
    ? addConditionalNavigationToState(state, {
      condition: {
        key: VOID,
      },
      postponedAction: creators.void(),
    })
    : state ?? undefined

  const newState = router.getStateForAction((translatePushAction(action)), interceptedState)
  return injectIsInitial<STATE>(newState ?? state)
}
