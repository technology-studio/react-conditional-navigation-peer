/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-04-25T05:44:24+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import * as ReactNavigation from 'react-navigation'

import type { Condition } from '../../Model/Types'

export type NavigationParams = ReactNavigation.NavigationParams & {
  reset?: boolean,
}

// ##### TYPES #####

export const types = {
  VOID: 'Navigation/VOID',
  BACK: ReactNavigation.NavigationActions.BACK,
  NAVIGATE: ReactNavigation.NavigationActions.NAVIGATE,
  SET_PARAMS: ReactNavigation.NavigationActions.SET_PARAMS,
  CANCEL_FLOW: 'Navigation/CANCEL_FLOW',
  FINISH_FLOW_AND_CONTINUE: 'Navigation/FINISH_FLOW_AND_CONTINUE',
  REQUIRE_CONDITIONS: 'Navigation/REQUIRE_CONDITIONS',
  VALIDATE_CONDITIONS: 'Navigation/VALIDATE_CONDITIONS',
  ALL: 'Navigation/ALL',
}

// ##### ACTION LIST #####

export type NavigationVoidAction = {|
  type: typeof types.VOID,
|}

export type NavigationBackAction = {|
  type: typeof types.BACK,
  key?: ?string,
  routeName?: string,
  count?: number,
  backToRouteName?: boolean,
|}

export type PromiseCallbacks = {
  resolve: () => void,
  reject: () => void,
}

export type NavigationNavigateAction = $Exact<ReactNavigation.NavigationNavigateAction & {
  routeName: string,
  params?: NavigationParams,
  flow?: boolean,
  skipConditionalNavigation?: boolean,
  promiseCallbacks?: PromiseCallbacks,
}>

export type NavigationCancelFlowAction = {|
  type: typeof types.FINISH_FLOW_AND_CONTINUE,
  promiseCallbacks?: PromiseCallbacks,
|}

export type NavigationFinishFlowAndContinueAction = {|
  type: typeof types.FINISH_FLOW_AND_CONTINUE,
  params?: NavigationParams,
  promiseCallbacks?: PromiseCallbacks,
|}

export type NavigationSetParamsAction = {|
  type: typeof types.SET_PARAMS,
  routeName?: string,
  key?: string,
  params: NavigationParams,
  promiseCallbacks?: PromiseCallbacks,
|}

export type NavigationRequireConditionsAction = {|
  type: typeof types.REQUIRE_CONDITIONS,
  conditionList: Condition[],
  promiseCallbacks?: PromiseCallbacks,
|}

export type NavigationValidateConditionsAction = {|
  type: typeof types.VALIDATE_CONDITIONS,
|}

export type NavigationAllAction = {|
  type: typeof types.ALL,
  actionList: NavigationAction[], // eslint-disable-line
|}

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
  key?: ?string,
  routeName?: string,
  count?: number,
  backToRouteName?: boolean,
}

type InitPayload = {
  params?: NavigationParams,
}

export type NavigatePayload = {
  routeName: string,
  flow?: boolean,
  params?: ?NavigationParams,
  action?: ?ReactNavigation.NavigationNavigateAction,
  skipConditionalNavigation?: boolean,
}

export type FinishFlowAndContinuePayload = {
  params?: ?NavigationParams,
}

export type ResetPayload = {
  index: number,
  key?: ?string,
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
  reset: (payload: ResetPayload) => ReactNavigation.NavigationResetAction,
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
