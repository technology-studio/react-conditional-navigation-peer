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

const log = new Log('txo.react-conditional-navigation.Navigation.onActionFactory')

export const onActionFactory = (onAction: OnAction) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction>): boolean => {
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
  const actionCreatorAttributes: OnActionAttributes = { action, getState, setState, nextOnAction, originalOnAction: onAction, restArgs, router, routerConfigOptions, screenConditionsMap }
  const actionCreatorMap = {
    CANCEL_FLOW: cancelFlowActionCreator,
    FINISH_FLOW_AND_CONTINUE: finishFlowAndContinueActionCreator,
    GO_BACK: backActionCreator,
    NAVIGATE: navigateActionCreator,
  }

  const actionCreator = type in actionCreatorMap ? actionCreatorMap[type as keyof typeof actionCreatorMap] : undefined
  return actionCreator ? actionCreator(actionCreatorAttributes) : onAction(...args)
}
