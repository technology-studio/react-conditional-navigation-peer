/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-10-28T09:10:38+02:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationState,
  PartialState,
} from '@react-navigation/native'
import { Log } from '@txo/log'

import type {
  ActionCreatorAttributes,
  Condition,
} from '../Model/Types'

import { navigateActionCreator } from './Navigate'

const log = new Log('app.Modules.ReactConditionalNavigation.Navigation.onActionFactory')

type OnActionFactoryAttributes = {
  getState: () => NavigationState | PartialState<NavigationState> | undefined,
  nextOnAction: (...args: any) => boolean,
  screenConditionsMap: Record<string, Condition[]>,
  setState: (state: NavigationState | PartialState<NavigationState> | undefined) => void,
}

export const onActionFactory = (onAction: any) => (attributes: OnActionFactoryAttributes, ...args: any): boolean => {
  const {
    nextOnAction,
    screenConditionsMap,
    getState,
    setState,
  } = attributes
  const [action, ...restArgs] = args

  const { type } = action ?? {}
  log.debug('N: onAction', { screenConditionsMap, action })
  const actionCreatorAttributes: ActionCreatorAttributes = { action, getState, setState, nextOnAction, originalOnAction: onAction, restArgs, screenConditionsMap }
  const actionCreatorMap = {
    NAVIGATE: navigateActionCreator,
  }

  const actionCreator = actionCreatorMap[type]
  return actionCreator ? actionCreator(actionCreatorAttributes) : onAction(...args)
}
