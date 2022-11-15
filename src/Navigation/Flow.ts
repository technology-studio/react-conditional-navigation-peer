/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-04T12:11:73+01:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationState,
} from '@react-navigation/native'
import { Log } from '@txo/log'

import type {
  OnActionAttributes,
  ConditionalNavigationState,
} from '../Model/Types'

const log = new Log('txo.react-conditional-navigation.Navigation.Flow')

const findLatestConditionNavigationState = (
  rootStackNavigatorRoutes: NavigationState['routes'],
): ConditionalNavigationState | undefined => rootStackNavigatorRoutes.reduce<{
  latestConditionalNavigation: ConditionalNavigationState | undefined,
  latestLogicalTimestamp: number,
}>(({ latestConditionalNavigation, latestLogicalTimestamp }, route) => {
  const { conditionalNavigation } = route
  if (conditionalNavigation) {
    const { logicalTimestamp } = conditionalNavigation
    log.debug('findLatest', { conditionalNavigation, logicalTimestamp, latestLogicalTimestamp, latestConditionalNavigation })
    if (logicalTimestamp > latestLogicalTimestamp) {
      return {
        latestConditionalNavigation: conditionalNavigation,
        latestLogicalTimestamp: logicalTimestamp,
      }
    }
  }
  return {
    latestConditionalNavigation,
    latestLogicalTimestamp,
  }
}, { latestConditionalNavigation: undefined, latestLogicalTimestamp: 0 }).latestConditionalNavigation

export const abstractFlowActionCreatorFactory = (type: 'CANCEL_FLOW' | 'FINISH_FLOW_AND_CONTINUE') => ({
  getState,
  nextOnAction,
  restArgs,
  setState,
}: OnActionAttributes): boolean => {
  const state = getState()
  if (state?.routes) {
    const { previousState, postponedAction } = findLatestConditionNavigationState(state.routes) ?? {}
    log.debug(`${type}: onAction - abstractFlowActionCreatorFactory`, { type, previousState, state })
    if (previousState) {
      setState(previousState)
      return type === 'FINISH_FLOW_AND_CONTINUE'
        ? postponedAction ? nextOnAction(postponedAction, ...restArgs) : true
        : true
    }
  }
  return false
}

export const cancelFlowActionCreator = abstractFlowActionCreatorFactory('CANCEL_FLOW')

export const finishFlowAndContinueActionCreator = abstractFlowActionCreatorFactory('FINISH_FLOW_AND_CONTINUE')
