/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-03-16T20:03:9001:00
 * @Copyright: Technology Studio
**/

import type {
  Action,
  Dispatch,
  Middleware,
  Reducer,
} from 'redux'
import * as ReactNavigation from 'react-navigation'
import { ConfigManager } from '@txo/config-manager'
import { ValuesType } from 'utility-types'

declare module 'react-redux' {
  interface DefaultRootState {
    navigation: ReactNavigation.NavigationState | null,
  }
}

declare module '@txo-peer-dep/react-conditional-navigation' {
  const createNavigationReducer: <STATE extends ReactNavigation.NavigationState>(router: ReactNavigation.NavigationRouter<STATE, unknown>) => Reducer<STATE | null, Action<any>>

  type ResolveCondition<CONDITION extends Condition, ROOT_STATE> = (
    condition: CONDITION,
    navigationAction: NavigationAction,
    rootState: ROOT_STATE,
  ) => NavigationAction | undefined

  const registerResolveCondition: (conditionKey: string, resolveCondition: ResolveCondition) => void

  const createNavigationMiddleware: () => Middleware

  const navigationParams = <PARAMS extends Record<string, unknown>>(props: NavigationProps<PARAMS>): PARAMS => props.navigation.state.params || {}

  class NavigationManager {
    _dispatch: Dispatch | null

    constructor(): void

    _setDispatch(dispatch: Dispatch): void

    _getDispatch(): Dispatch

    dispatchAction<ACTION extends {
      type: unknown,
    }>(
      action: ACTION,
    ): void
    navigate(payload: NavigatePayload): void
    back(payload?: BackPayload): void
    setParams(payload: SetParamsPayload): void
    dispatchNavigationAction(navigationAction: NavigationAction): void
    async all(navigationActionList: NavigationAction[]): void
    async cancelFlow(): void
    async finishFlowAndContinue(payload?: FinishFlowAndContinuePayload): void
    async requireConditions(payload: RequireConditionsPayload): void
    async validateConditions(): void
    async backAndNavigate(payload: {
      back?: BackPayload,
      navigate: NavigatePayload,
    }): void
    async backAndSetParams(payload: {
      back?: BackPayload,
      setParams: SetParamsPayload,
    }): void
  }

  const navigationManager: NavigationManager

  type NavigationProps<
    PARAMS extends Record<string, unknown> = Record<string, unknown>,
    OPTIONS extends Record<string, unknown> = Record<string, unknown>,
    SCREEN_PROPS extends Record<string, unknown> = Record<string, unknown>,
    > = {
      navigation: ReactNavigation.NavigationScreenProp<{ params: PARAMS } & ReactNavigation.NavigationRoute>,
      screenProps?: SCREEN_PROPS,
      navigationOptions?: OPTIONS,
    }

  type Condition = {
    key: string,
  }

  type NavigationParams = ReactNavigation.NavigationParams
  //  & {
  //   reset?: boolean,
  // }

  // ##### TYPES #####

  const types = {
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

  type NavigationVoidAction = {
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

  const navigationActionCreators: {
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

  const isInitialNavigationOptions: <OPTIONS extends Record<string, unknown>>(
    navigationOptions?: ReactNavigation.NavigationScreenConfig<OPTIONS>
  ) => ReactNavigation.NavigationScreenConfig<OPTIONS>

  const combineReducers: <O extends string | number | symbol, A extends Action<any>>(
    reducers: O,
    parentStateKeys?: keyof O[]
  ) => Reducer<Record<O, <S>(r: unknown) => S>, A>

  const navigatorTypes = {
    STACK: 'STACK' as const,
    TAB: 'TAB' as const,
  }

  export type NavigatorType = ValuesType<typeof navigatorTypes>

  export type Config = {
    ignoreConditionalNavigation: boolean,
    routeNameToNavigatorTypeMap: Record<string, NavigatorType>,
  }

  const configManager: ConfigManager<Config>

}
