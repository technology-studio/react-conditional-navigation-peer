/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-10-18T17:23:43+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { configManager } from './Config'
import { navigationManager } from './Api/NavigationManager'
import type { NavigationProps } from './Screens/Types'
import { PropTypes as navigationPropTypes, navigationParams } from './Screens'
import {
  type NavigatePayload,
  type NavigationAction,
  type NavigationAllAction,
  type NavigationBackAction,
  type NavigationCancelFlowAction,
  type NavigationFinishFlowAndContinueAction,
  type NavigationNavigateAction,
  type NavigationRequireConditionsAction,
  type NavigationSetParamsAction,
  type NavigationValidateConditionsAction,
  types as navigationTypes,
} from './Redux/Types/NavigationReduxTypes'
import { creators as navigationActionCreators } from './Redux/NavigationRedux'
import type {
  Condition,
  NavigatorType,
} from './Model/Types'
import { navigatorTypes } from './Model/Types'
import {
  combineReducers,
  createNavigationMiddleware,
  createNavigationReducer,
} from './Redux'
import type {
  RootStateFragment,
  State as NavigationState,
} from './Redux/Types'
import { connectConditionalNavigation } from './Navigation/RootNavigator'

import {
  type ResolveCondition,
  conditionalNavigationManager,
  registerResolveCondition,
} from './Api/ConditionalNavigationManager'

export {
  combineReducers,
  conditionalNavigationManager,
  configManager,
  connectConditionalNavigation,
  createNavigationMiddleware,
  createNavigationReducer,
  navigationActionCreators,
  navigationManager,
  navigationParams,
  navigationPropTypes,
  navigationTypes,
  navigatorTypes,
  registerResolveCondition,
}

export type {
  Condition,
  NavigatePayload,
  NavigationAction,
  NavigationAllAction,
  NavigationBackAction,
  NavigationCancelFlowAction,
  NavigationFinishFlowAndContinueAction,
  NavigationNavigateAction,
  NavigationProps,
  NavigationRequireConditionsAction,
  NavigationSetParamsAction,
  NavigationState,
  NavigationValidateConditionsAction,
  NavigatorType,
  ResolveCondition,
  RootStateFragment,
}
