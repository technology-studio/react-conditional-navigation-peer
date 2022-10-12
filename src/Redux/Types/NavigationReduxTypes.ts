/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-04-25T05:44:24+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import * as ReactNavigation from 'react-navigation'

import type { Condition } from '../../Model/Types'

export type NavigationParams = ReactNavigation.NavigationParams
//  & {
//   +reset?: boolean,
// }

// ##### TYPES #####

export const types = {
  VOID: 'Navigation/VOID',
  BACK: ReactNavigation.NavigationActions.BACK,
  NAVIGATE: ReactNavigation.NavigationActions.NAVIGATE,
  PUSH: ReactNavigation.StackActions.PUSH,
  SET_PARAMS: ReactNavigation.NavigationActions.SET_PARAMS,
  CANCEL_FLOW: 'Navigation/CANCEL_FLOW',
  FINISH_FLOW_AND_CONTINUE: 'Navigation/FINISH_FLOW_AND_CONTINUE',
  REQUIRE_CONDITIONS: 'Navigation/REQUIRE_CONDITIONS',
  VALIDATE_CONDITIONS: 'Navigation/VALIDATE_CONDITIONS',
  ALL: 'Navigation/ALL',
}

// ##### ACTION LIST #####

export type NavigationVoidAction = {
  type: typeof types.VOID,
}

export type NavigationBackAction = {
  type: typeof types.BACK,
  key?: string | null,
  routeName?: string,
  count?: number,
  backToRouteName?: boolean,
}

export type PromiseCallbacks = {
  resolve: () => void,
  reject: () => void,
}

export type NavigationNavigateAction = ReactNavigation.NavigationNavigateAction & {
  routeName: string,
  params?: NavigationParams,
  push?: boolean,
  flow?: boolean,
  skipConditionalNavigation?: boolean,
  promiseCallbacks?: PromiseCallbacks,
}

export type NavigationNavigatePushAction = Omit<NavigationNavigateAction, 'type'> & {
  type: typeof types.PUSH,
}

export type NavigationCancelFlowAction = {
  type: typeof types.FINISH_FLOW_AND_CONTINUE,
  flowConditionKey?: string,
  promiseCallbacks?: PromiseCallbacks,
}

export type NavigationFinishFlowAndContinueAction = {
  type: typeof types.FINISH_FLOW_AND_CONTINUE,
  params?: NavigationParams,
  flowConditionKey?: string,
  promiseCallbacks?: PromiseCallbacks,
}

export type NavigationSetParamsAction = {
  type: typeof types.SET_PARAMS,
  routeName?: string,
  key?: string,
  params: NavigationParams,
  promiseCallbacks?: PromiseCallbacks,
}

export type NavigationRequireConditionsAction = {
  type: typeof types.REQUIRE_CONDITIONS,
  conditionList: Condition[],
  promiseCallbacks?: PromiseCallbacks,
}

export type NavigationValidateConditionsAction = {
  type: typeof types.VALIDATE_CONDITIONS,
}

export type NavigationAllAction = {
  type: typeof types.ALL,
  actionList: NavigationAction[],
}

export type NavigationAction =
  NavigationVoidAction |
  NavigationBackAction |
  ReactNavigation.NavigationInitAction |
  NavigationNavigateAction |
  ReactNavigation.NavigationResetAction |
  NavigationSetParamsAction |
  NavigationCancelFlowAction |
  NavigationFinishFlowAndContinueAction |
  NavigationRequireConditionsAction |
  NavigationValidateConditionsAction |
  NavigationAllAction

// ##### PAYLOADS #####

export type BackPayload = {
  key?: string | null,
  routeName?: string,
  count?: number,
  backToRouteName?: boolean,
}

export type CancelFlowPayload = {
  flowConditionKey?: string,
}

type InitPayload = {
  params?: NavigationParams,
}

export type NavigatePayload = {
  routeName: string,
  flow?: boolean,
  push?: boolean,
  params?: NavigationParams | null,
  action?: ReactNavigation.NavigationNavigateAction | null,
  skipConditionalNavigation?: boolean,
}

export type FinishFlowAndContinuePayload = {
  params?: NavigationParams | null,
  flowConditionKey?: string,
}

export type ResetPayload = {
  index: number,
  key?: string | null,
  actions: NavigationNavigateAction[],
}

export type SetParamsPayload = {
  routeName?: string,
  key?: string,
  params: NavigationParams,
}

export type RequireConditionsPayload = {
  conditionList: Condition[],
}

export type Creators = {
  void: () => NavigationVoidAction,
  back: (payload?: BackPayload) => NavigationBackAction,
  init: (payload?: InitPayload) => ReactNavigation.NavigationInitAction,
  navigate: (payload: NavigatePayload) => NavigationNavigateAction,
  // TODO: find out if this can be removed - creators in NavigationRedux.ts don't contain reset
  // reset: (payload: ResetPayload) => ReactNavigation.NavigationResetAction,
  setParams: (payload: SetParamsPayload) => NavigationSetParamsAction,
  cancelFlow: () => NavigationCancelFlowAction,
  finishFlowAndContinue: (payload?: FinishFlowAndContinuePayload) => NavigationFinishFlowAndContinueAction,
  requireConditions: (payload: RequireConditionsPayload) => NavigationRequireConditionsAction,
  validateConditions: () => NavigationValidateConditionsAction,
  all: (actionList: NavigationAction[]) => NavigationAllAction,
}

export type ConditionalNavigationState = {
  condition: Condition,
  postponedAction: NavigationAction,
}

export type ResolveConditionsResult = {
  navigationAction: NavigationAction,
  conditionalNavigationState: ConditionalNavigationState,
}

export type ConditionalNavigationRoute = ReactNavigation.NavigationRoute & {
  conditionalNavigation?: ConditionalNavigationState,
}
