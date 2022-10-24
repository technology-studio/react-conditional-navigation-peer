/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-31T20:26:19+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { NavigationActions as navigationCreators } from 'react-navigation'
import type {
  NavigationRouter, NavigationState,
} from 'react-navigation'
import { Log } from '@txo/log'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import type { AnyAction } from 'redux'

import type { NavigationReducer } from '../../Model/Types'
import type {
  NavigationSetParamsAction,
} from '../Types/NavigationReduxTypes'

import {
  getStateNearestRouteKeyByRouteName, getStateCurrentRouteKey,
} from './Utils'

const log = new Log('txo.react-conditional-navigation.Redux.Reducers.setParamsReducer')

export const setParamsReducer = <STATE extends NavigationState, ROOT_STATE extends DefaultRootState>(
  router: NavigationRouter<STATE>,
  parentReducer: NavigationReducer<STATE | null, AnyAction, ROOT_STATE>,
  state: STATE | null,
  action: NavigationSetParamsAction,
  rootState: ROOT_STATE,
): STATE | null => {
  log.debug('SP: START', { state, action })
  const { params, routeName, key } = action
  const newKey = (key ?? (routeName && getStateNearestRouteKeyByRouteName(state, routeName))) ?? (!key && !routeName && getStateCurrentRouteKey(state))
  log.debug('SP: FOUND KEY', { newKey })
  const newStateAfterSetParams = newKey && router.getStateForAction(navigationCreators.setParams({ key: newKey, params }), state ?? undefined)
  log.debug('SP: AFTER SET PARAMS', { newStateAfterSetParams })
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return newStateAfterSetParams || state
}
