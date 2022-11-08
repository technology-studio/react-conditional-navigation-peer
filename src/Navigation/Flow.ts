/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-04T12:11:73+01:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationState,
} from '@react-navigation/native'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import { Log } from '@txo/log'

import type {
  ActionCreatorAttributes,
} from '../Model/Types'
import type {
  ConditionalNavigationState,
} from '../Redux/Types/NavigationReduxTypes'

const log = new Log('app.Modules.ReactConditionalNavigation.Navigation.Flow')

const findLatestConditionNavigationState = (
  rootStackNavigatorRoutes: NavigationState['routes'],
): ConditionalNavigationState<DefaultRootState['navigation']> | undefined => rootStackNavigatorRoutes.reduce<{
  latestConditionalNavigationState: ConditionalNavigationState<DefaultRootState['navigation']> | undefined,
  latestLogicalTimestamp: number,
}>(({ latestConditionalNavigationState, latestLogicalTimestamp }, route) => {
  const { conditionalNavigation } = route
  if (conditionalNavigation) {
    const { logicalTimestamp } = conditionalNavigation.conditionalNavigationState
    log.debug('findLatest', { conditionalNavigation, logicalTimestamp, latestLogicalTimestamp, latestConditionalNavigationState })
    if (logicalTimestamp > latestLogicalTimestamp) {
      return {
        latestConditionalNavigationState: conditionalNavigation.conditionalNavigationState,
        latestLogicalTimestamp: logicalTimestamp,
      }
    }
  }
  return {
    latestConditionalNavigationState,
    latestLogicalTimestamp,
  }
}, { latestConditionalNavigationState: undefined, latestLogicalTimestamp: 0 }).latestConditionalNavigationState

export const abstractFlowActionCreatorFactory = (type: 'CANCEL_FLOW' | 'FINISH_FLOW_AND_CONTINUE') => ({
  getState,
  nextOnAction,
  restArgs,
  setState,
}: ActionCreatorAttributes): boolean => {
  const state = getState()
  if (state?.routes) {
    const { previousState, postponedAction } = findLatestConditionNavigationState(state.routes) ?? {}
    log.debug('N: onAction - abstractFlowActionCreatorFactory', { type, previousState, state })
    if (previousState) {
      setState(previousState)
      return type === 'FINISH_FLOW_AND_CONTINUE' && postponedAction
        ? nextOnAction(postponedAction, ...restArgs)
        : true
    }
  }
  return false
}

export const cancelFlowActionCreator = abstractFlowActionCreatorFactory('CANCEL_FLOW')

export const finishFlowAndContinueActionCreator = abstractFlowActionCreatorFactory('FINISH_FLOW_AND_CONTINUE')
