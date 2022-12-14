/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:06:21+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import {
  types,
  type BackPayload,
  type CancelFlowPayload,
  type NavigatePayload,
  type SetParamsPayload,
  type FinishFlowAndContinuePayload,
  type RequireConditionsPayload,
  type NavigationAction,
  type NavigationVoidAction,
  type NavigationBackAction,
  type NavigationNavigateAction,
  type NavigationSetParamsAction,
  type NavigationCancelFlowAction,
  type NavigationFinishFlowAndContinueAction,
  type NavigationValidateConditionsAction,
  type NavigationRequireConditionsAction,
  type NavigationAllAction,
} from './Types/NavigationReduxTypes'

const createActionCreator = <ACTION_CREATOR: any>(type: string, fn: ACTION_CREATOR): ACTION_CREATOR => {
  fn.toString = () => type
  return fn
}

const voidCreator = createActionCreator(
  types.VOID,
  (): NavigationVoidAction => {
    const action: NavigationVoidAction = {
      type: types.VOID,
    }
    return action
  },
)

const backCreator = createActionCreator(
  types.BACK,
  (payload?: BackPayload): NavigationBackAction => {
    const action: $Exact<{ ...NavigationBackAction }> = {
      type: types.BACK,
    }
    if (payload) {
      if (payload.key) {
        action.key = payload.key
      }
      if (payload.routeName) {
        action.routeName = payload.routeName
      }
      if (payload.count) {
        action.count = payload.count
      }
      if (payload.backToRouteName) {
        action.backToRouteName = payload.backToRouteName
      }
    }
    return action
  },
)

const navigateCreator = createActionCreator(
  types.NAVIGATE,
  (payload: NavigatePayload): NavigationNavigateAction => {
    const action: $Exact<{ ...NavigationNavigateAction }> = {
      type: types.NAVIGATE,
      routeName: payload.routeName,
    }
    if (payload.push) {
      action.push = payload.push
    }
    if (payload.flow) {
      action.flow = payload.flow
    }
    if (payload.params) {
      action.params = payload.params
    }
    if (payload.action) {
      action.action = payload.action
    }
    if (payload.skipConditionalNavigation) {
      action.skipConditionalNavigation = payload.skipConditionalNavigation
    }
    return action
  },
)

const cancelFlowCreator = createActionCreator(
  types.CANCEL_FLOW,
  (payload?: CancelFlowPayload): NavigationCancelFlowAction => {
    const action: $Exact<{ ...NavigationCancelFlowAction }> = {
      type: types.CANCEL_FLOW,
    }
    if (payload && payload.flowConditionKey) {
      action.flowConditionKey = payload.flowConditionKey
    }
    return action
  },
)

const finishFlowAndContinueCreator = createActionCreator(
  types.FINISH_FLOW_AND_CONTINUE,
  (payload?: FinishFlowAndContinuePayload): NavigationFinishFlowAndContinueAction => {
    const action: $Exact<{ ...NavigationFinishFlowAndContinueAction }> = {
      type: types.FINISH_FLOW_AND_CONTINUE,
    }
    if (payload && payload.params) {
      action.params = payload.params
    }
    if (payload && payload.flowConditionKey) {
      action.flowConditionKey = payload.flowConditionKey
    }
    return action
  },
)

const requireConditionsCreator = createActionCreator(
  types.REQUIRE_CONDITIONS,
  (payload: RequireConditionsPayload): NavigationRequireConditionsAction => {
    const action: NavigationRequireConditionsAction = {
      type: types.REQUIRE_CONDITIONS,
      conditionList: payload.conditionList,
    }
    return action
  },
)

const validateConditionsCreator = createActionCreator(
  types.VALIDATE_CONDITIONS,
  (): NavigationValidateConditionsAction => {
    const action: NavigationValidateConditionsAction = {
      type: types.VALIDATE_CONDITIONS,
    }
    return action
  },
)

const setParamsCreator = createActionCreator(
  types.SET_PARAMS,
  (payload: SetParamsPayload): NavigationSetParamsAction => {
    const action: $Exact<{ ...NavigationSetParamsAction }> = {
      type: types.SET_PARAMS,
      params: payload.params,
    }
    if (payload.key) {
      action.key = payload.key
    }
    if (payload.routeName) {
      action.routeName = payload.routeName
    }
    return action
  },
)

const allCreator = createActionCreator(
  types.ALL,
  (actionList: NavigationAction[]): NavigationAllAction => {
    const action: NavigationAllAction = {
      type: types.ALL,
      actionList: actionList,
    }
    return action
  },
)

export const creators = {
  void: voidCreator,
  back: backCreator,
  navigate: navigateCreator,
  cancelFlow: cancelFlowCreator,
  setParams: setParamsCreator,
  finishFlowAndContinue: finishFlowAndContinueCreator,
  requireConditions: requireConditionsCreator,
  validateConditions: validateConditionsCreator,
  all: allCreator,
}
