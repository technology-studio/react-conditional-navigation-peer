/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-10-28T09:10:38+02:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'

import type {
  OnActionAttributes,
  OnAction,
  OnActionFactoryAttributes,
} from '../Model/Types'

import { backActionCreator } from './Back'
import {
  cancelFlowActionCreator,
  finishFlowAndContinueActionCreator,
} from './Flow'
import { navigateActionCreator } from './Navigate'
import { requireConditionsActionCreator } from './RequireConditions'
import { validateConditionsActionCreator } from './ValidateConditions'

const log = new Log('txo.react-conditional-navigation.Navigation.onActionFactory')

export const onActionFactory = (originalOnAction: OnAction) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction>): boolean => {
  const {
    nextOnAction,
    screenConditionsMap,
    getState,
    setState,
    router,
    routerConfigOptions,
  } = attributes
  const [action, ...restArgs] = args

  const { type } = action ?? {}
  log.debug('N: onAction', { screenConditionsMap, action })
  const onActionAttributes: OnActionAttributes = { action, getState, setState, nextOnAction, originalOnAction, restArgs, router, routerConfigOptions, screenConditionsMap }
  const onActionMap = {
    CANCEL_FLOW: cancelFlowActionCreator,
    FINISH_FLOW_AND_CONTINUE: finishFlowAndContinueActionCreator,
    GO_BACK: backActionCreator,
    NAVIGATE: navigateActionCreator,
    REQUIRE_CONDITIONS: requireConditionsActionCreator,
    VALIDATE_CONDITIONS: validateConditionsActionCreator,
  }

  const onAction = type in onActionMap ? onActionMap[type as keyof typeof onActionMap] : undefined
  return onAction ? onAction(onActionAttributes) : originalOnAction(...args)
}
